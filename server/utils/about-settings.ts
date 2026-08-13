import type { AboutContent, AboutImage, AboutSection } from '~~/shared/types/about'
import { ensureMediaRecord } from './media-records'

const MAX_SECTIONS = 20
const MAX_TITLE_LENGTH = 200
const MAX_TEXT_LENGTH = 30_000

function textValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function normalizeImage(value: unknown): AboutImage | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return
  const source = value as Record<string, unknown>
  const src = textValue(source.src, 500)
  const isAllowedPath = /^\/media\/(?:uploads|photos|static)\/[a-zA-Z0-9_./-]+$/.test(src)
  if (!isAllowedPath || src.includes('..')) return
  return { src, alt: textValue(source.alt, 300) }
}

export function normalizeAboutContent(value: unknown): AboutContent {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const usedIds = new Set<string>()
  const sections = Array.isArray(source.sections)
    ? source.sections.slice(0, MAX_SECTIONS).map((value, index): AboutSection | undefined => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return
        const section = value as Record<string, unknown>
        const image = normalizeImage(section.image)
        if (!image) return

        const baseId = textValue(section.id, 80)
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, '-')
          .replace(/^-+|-+$/g, '') || `section-${index + 1}`
        let id = baseId
        let suffix = 2
        while (usedIds.has(id)) id = `${baseId}-${suffix++}`
        usedIds.add(id)

        return {
          id,
          title: textValue(section.title, MAX_TITLE_LENGTH),
          text: textValue(section.text, MAX_TEXT_LENGTH),
          image,
        }
      }).filter((section): section is AboutSection => Boolean(section))
    : []

  return { sections }
}

export async function readAboutContent(): Promise<AboutContent> {
  const page = await prisma.aboutPage.findUnique({
    where: { id: 'main' },
    include: { sections: { include: { media: true }, orderBy: { sortOrder: 'asc' } } },
  })
  if (!page) return { sections: [] }

  return {
    sections: page.sections.map(section => ({
      id: section.id,
      title: section.title,
      text: section.text,
      image: { src: section.media.path, alt: section.imageAlt },
    })),
  }
}

export async function writeAboutContent(value: unknown) {
  const content = normalizeAboutContent(value)
  if (!content.sections.length || content.sections.some(section => !section.title || !section.text)) {
    throw createError({ statusCode: 400, statusMessage: 'Заполните заголовок, текст и изображение каждого раздела' })
  }

  await prisma.$transaction(async (tx) => {
    await tx.aboutPage.upsert({ where: { id: 'main' }, update: {}, create: { id: 'main' } })
    await tx.aboutSection.deleteMany({ where: { pageId: 'main' } })

    for (const [sortOrder, section] of content.sections.entries()) {
      const media = await ensureMediaRecord(tx, section.image.src, { alt: section.image.alt })
      await tx.aboutSection.create({
        data: {
          id: section.id,
          pageId: 'main',
          title: section.title,
          text: section.text,
          mediaId: media.id,
          imageAlt: section.image.alt,
          sortOrder,
        },
      })
    }
  })
  return content
}
