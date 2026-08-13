export interface BlogImage {
  src: string
  alt: string
}

export type BlogPostStatus = 'draft' | 'published'

export interface BlogTextMark {
  type: 'bold' | 'italic' | 'link'
  attrs?: { href?: string, target?: string, rel?: string }
}

export interface BlogTextNode {
  type: 'doc' | 'paragraph' | 'heading' | 'bulletList' | 'orderedList' | 'listItem' | 'text' | 'hardBreak'
  attrs?: { level?: 2 | 3 }
  marks?: BlogTextMark[]
  text?: string
  content?: BlogTextNode[]
}

export interface BlogTextSection {
  id: string
  type: 'text'
  content: BlogTextNode
}

export interface BlogImageSection {
  id: string
  type: 'image'
  image: BlogImage
  caption: string
}

export type BlogSection = BlogTextSection | BlogImageSection

export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string
  cover: BlogImage
  publishedAt: string | null
}

export interface BlogPost extends BlogPostSummary {
  status: BlogPostStatus
  seoTitle: string
  seoDescription: string
  createdAt: string
  updatedAt: string
  sections: BlogSection[]
}

export interface BlogPostInput {
  title: string
  slug: string
  excerpt: string
  cover: BlogImage
  status: BlogPostStatus
  seoTitle: string
  seoDescription: string
  publishedAt: string | null
  sections: BlogSection[]
}

export interface BlogAdminListItem extends BlogPostSummary {
  status: BlogPostStatus
  updatedAt: string
}

export interface BlogAdminList {
  items: BlogAdminListItem[]
}

export interface BlogPublicList {
  items: BlogPostSummary[]
}

export function createEmptyTextDocument(): BlogTextNode {
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}

export function createEmptyBlogPost(): BlogPostInput {
  return {
    title: '',
    slug: '',
    excerpt: '',
    cover: { src: '/media/static/313.jpg', alt: 'Studio 313' },
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    publishedAt: null,
    sections: [{ id: 'section-1', type: 'text', content: createEmptyTextDocument() }],
  }
}
