import type {
  BlogAdminList,
  BlogImage,
  BlogPost,
  BlogPostInput,
  BlogPostStatus,
  BlogPublicList,
  BlogSection,
  BlogTextMark,
  BlogTextNode,
} from '~~/shared/types/blog'
import { slugify } from '~~/shared/lib/slugify'
import type { Prisma } from '../generated/prisma/client'
import { ensureMediaRecord } from './media-records'

const MAX_SECTIONS = 80
const MAX_TEXT_NODES = 2_000
const MAX_TEXT_LENGTH = 120_000
const allowedNodeTypes = new Set(['doc', 'paragraph', 'heading', 'bulletList', 'orderedList', 'listItem', 'text', 'hardBreak'])
const allowedMarkTypes = new Set(['bold', 'italic', 'link'])

function textValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function normalizeImage(value: unknown): BlogImage | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return
  const source = value as Record<string, unknown>
  const src = textValue(source.src, 500)
  const allowed = /^\/media\/(?:uploads|photos|static)\/[a-zA-Z0-9_./-]+$/.test(src)
  if (!allowed || src.includes('..')) return
  return { src, alt: textValue(source.alt, 300) }
}

function normalizeMarks(value: unknown): BlogTextMark[] | undefined {
  if (!Array.isArray(value)) return
  const marks = value.flatMap((mark): BlogTextMark[] => {
    if (!mark || typeof mark !== 'object' || Array.isArray(mark)) return []
    const source = mark as Record<string, unknown>
    const type = textValue(source.type, 20) as BlogTextMark['type']
    if (!allowedMarkTypes.has(type)) return []
    if (type !== 'link') return [{ type }]
    const attributes = source.attrs && typeof source.attrs === 'object' && !Array.isArray(source.attrs)
      ? source.attrs as Record<string, unknown>
      : {}
    const href = textValue(attributes.href, 1_000)
    if (!/^(?:https?:\/\/|mailto:)/i.test(href)) return []
    return [{ type, attrs: { href, target: '_blank', rel: 'noopener noreferrer nofollow' } }]
  })
  return marks.length ? marks : undefined
}

function normalizeTextDocument(value: unknown): BlogTextNode {
  let nodeCount = 0
  let characterCount = 0

  function visit(value: unknown, depth = 0): BlogTextNode | undefined {
    if (depth > 12 || nodeCount >= MAX_TEXT_NODES || !value || typeof value !== 'object' || Array.isArray(value)) return
    const source = value as Record<string, unknown>
    const type = textValue(source.type, 30) as BlogTextNode['type']
    if (!allowedNodeTypes.has(type)) return
    nodeCount += 1

    if (type === 'text') {
      const text = typeof source.text === 'string'
        ? source.text.slice(0, Math.max(0, MAX_TEXT_LENGTH - characterCount))
        : ''
      characterCount += text.length
      return { type, text, marks: normalizeMarks(source.marks) }
    }

    if (type === 'hardBreak') return { type }
    const content = Array.isArray(source.content)
      ? source.content.map(child => visit(child, depth + 1)).filter((child): child is BlogTextNode => Boolean(child))
      : undefined

    if (type === 'heading') {
      const requestedLevel = Number((source.attrs as Record<string, unknown> | undefined)?.level)
      return { type, attrs: { level: requestedLevel === 3 ? 3 : 2 }, content }
    }

    return { type, content }
  }

  const result = visit(value)
  if (!result || result.type !== 'doc') return { type: 'doc', content: [{ type: 'paragraph' }] }
  return result
}

function documentText(node: BlogTextNode): string {
  return [node.text || '', ...(node.content || []).map(documentText)].join(' ').trim()
}

function normalizeStatus(value: unknown): BlogPostStatus {
  return value === 'published' ? 'published' : 'draft'
}

function normalizePublishedAt(value: unknown) {
  if (typeof value !== 'string' || !value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function normalizeBlogPostInput(value: unknown): BlogPostInput {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const usedIds = new Set<string>()
  const sections = Array.isArray(source.sections)
    ? source.sections.slice(0, MAX_SECTIONS).flatMap((value, index): BlogSection[] => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return []
        const section = value as Record<string, unknown>
        const type = section.type === 'image' ? 'image' : 'text'
        const baseId = textValue(section.id, 100).replace(/[^a-zA-Z0-9_-]+/g, '-') || `section-${index + 1}`
        let id = baseId
        let suffix = 2
        while (usedIds.has(id)) id = `${baseId}-${suffix++}`
        usedIds.add(id)

        if (type === 'image') {
          const image = normalizeImage(section.image)
          return image ? [{ id, type, image, caption: textValue(section.caption, 500) }] : []
        }
        return [{ id, type, content: normalizeTextDocument(section.content) }]
      })
    : []

  const status = normalizeStatus(source.status)
  const publishedAt = normalizePublishedAt(source.publishedAt)
  return {
    title: textValue(source.title, 220),
    slug: slugify(textValue(source.slug, 180)),
    excerpt: textValue(source.excerpt, 500),
    cover: normalizeImage(source.cover) || { src: '', alt: '' },
    status,
    seoTitle: textValue(source.seoTitle, 220),
    seoDescription: textValue(source.seoDescription, 500),
    publishedAt: (status === 'published' ? publishedAt || new Date() : publishedAt)?.toISOString() || null,
    sections,
  }
}

const postInclude = {
  cover: true,
  sections: { include: { media: true }, orderBy: { sortOrder: 'asc' as const } },
} satisfies Prisma.BlogPostInclude

type BlogPostRecord = Prisma.BlogPostGetPayload<{ include: typeof postInclude }>

function mapPost(post: BlogPostRecord): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    cover: { src: post.cover.path, alt: post.coverAlt },
    status: normalizeStatus(post.status),
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    publishedAt: post.publishedAt?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    sections: post.sections.flatMap((section): BlogSection[] => {
      if (section.type === 'image') {
        if (!section.media) return []
        return [{
          id: section.id,
          type: 'image',
          image: { src: section.media.path, alt: section.imageAlt },
          caption: section.caption,
        }]
      }
      return [{
        id: section.id,
        type: 'text',
        content: normalizeTextDocument(JSON.parse(section.content || '{}')),
      }]
    }),
  }
}

export async function readPublicBlogList(): Promise<BlogPublicList> {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published', publishedAt: { lte: new Date() } },
    include: { cover: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  })
  return {
    items: posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      cover: { src: post.cover.path, alt: post.coverAlt },
      publishedAt: post.publishedAt?.toISOString() || null,
    })),
  }
}

export async function readAdminBlogList(): Promise<BlogAdminList> {
  const posts = await prisma.blogPost.findMany({ include: { cover: true }, orderBy: { updatedAt: 'desc' } })
  return {
    items: posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      cover: { src: post.cover.path, alt: post.coverAlt },
      status: post.status as BlogPostStatus,
      publishedAt: post.publishedAt?.toISOString() || null,
      updatedAt: post.updatedAt.toISOString(),
    })),
  }
}

export async function readBlogPostById(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id }, include: postInclude })
  return post ? mapPost(post) : null
}

export async function readPublishedBlogPost(slug: string) {
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: 'published', publishedAt: { lte: new Date() } },
    include: postInclude,
  })
  return post ? mapPost(post) : null
}

export async function updateBlogPostStatus(id: string, value: unknown) {
  if (value !== 'draft' && value !== 'published') {
    throw createError({ statusCode: 400, statusMessage: 'Некорректный статус статьи' })
  }

  const post = await prisma.blogPost.findUnique({
    where: { id },
    select: { id: true, publishedAt: true },
  })
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })

  await prisma.blogPost.update({
    where: { id },
    data: {
      status: value,
      publishedAt: value === 'published' ? post.publishedAt || new Date() : post.publishedAt,
    },
  })
  return readBlogPostById(id)
}

export async function writeBlogPost(value: unknown, id?: string) {
  const content = normalizeBlogPostInput(value)
  const hasText = content.sections.some(section => section.type === 'text' && documentText(section.content))
  if (!content.title || !content.slug || !content.excerpt || !content.cover.src || !content.sections.length || !hasText) {
    throw createError({ statusCode: 400, statusMessage: 'Заполните заголовок, slug, анонс, обложку и текст статьи' })
  }
  const slugOwner = await prisma.blogPost.findUnique({ where: { slug: content.slug }, select: { id: true } })
  if (slugOwner && slugOwner.id !== id) {
    throw createError({ statusCode: 409, statusMessage: 'Статья с таким slug уже существует' })
  }
  if (id && !(await prisma.blogPost.findUnique({ where: { id }, select: { id: true } }))) {
    throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
  }

  const postId = await prisma.$transaction(async (tx) => {
    const cover = await ensureMediaRecord(tx, content.cover.src, { alt: content.cover.alt })
    const data = {
      title: content.title,
      slug: content.slug,
      excerpt: content.excerpt,
      coverId: cover.id,
      coverAlt: content.cover.alt,
      status: content.status,
      seoTitle: content.seoTitle,
      seoDescription: content.seoDescription,
      publishedAt: content.publishedAt ? new Date(content.publishedAt) : null,
    }
    const post = id
      ? await tx.blogPost.update({ where: { id }, data })
      : await tx.blogPost.create({ data })
    await tx.blogSection.deleteMany({ where: { postId: post.id } })
    for (const [sortOrder, section] of content.sections.entries()) {
      if (section.type === 'image') {
        const media = await ensureMediaRecord(tx, section.image.src, { alt: section.image.alt })
        await tx.blogSection.create({
          data: { postId: post.id, type: 'image', mediaId: media.id, imageAlt: section.image.alt, caption: section.caption, sortOrder },
        })
      }
      else {
        await tx.blogSection.create({
          data: { postId: post.id, type: 'text', content: JSON.stringify(section.content), sortOrder },
        })
      }
    }
    return post.id
  })
  return readBlogPostById(postId)
}

export async function deleteBlogPost(id: string) {
  const result = await prisma.blogPost.deleteMany({ where: { id } })
  if (!result.count) throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
  return { deleted: true }
}
