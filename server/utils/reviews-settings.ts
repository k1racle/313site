import type { Review, ReviewsContent } from '~~/shared/types/reviews'

const MAX_REVIEWS = 100
const MAX_NAME_LENGTH = 160
const MAX_SUBTITLE_LENGTH = 300
const VK_HOSTS = new Set(['vkvideo.ru', 'www.vkvideo.ru', 'vk.com', 'www.vk.com'])

function textValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function normalizeVkVideoUrl(value: unknown) {
  if (typeof value !== 'string') return ''
  let url: URL
  try { url = new URL(value.trim()) }
  catch { return '' }
  if (url.protocol !== 'https:' || !VK_HOSTS.has(url.hostname.toLowerCase())) return ''

  if (url.pathname === '/video_ext.php') {
    const oid = url.searchParams.get('oid') || ''
    const id = url.searchParams.get('id') || ''
    const hash = url.searchParams.get('hash') || ''
    const hd = url.searchParams.get('hd') || '2'
    if (!/^-?\d+$/.test(oid) || !/^\d+$/.test(id)) return ''
    const normalized = new URL('https://vkvideo.ru/video_ext.php')
    normalized.searchParams.set('oid', oid)
    normalized.searchParams.set('id', id)
    normalized.searchParams.set('hd', /^\d$/.test(hd) ? hd : '2')
    if (/^[a-zA-Z0-9_-]{6,160}$/.test(hash)) normalized.searchParams.set('hash', hash)
    return normalized.toString()
  }

  const match = url.pathname.match(/^\/video(-?\d+)_(\d+)\/?$/)
  if (!match) return ''
  const normalized = new URL('https://vkvideo.ru/video_ext.php')
  normalized.searchParams.set('oid', match[1] || '')
  normalized.searchParams.set('id', match[2] || '')
  normalized.searchParams.set('hd', '2')
  return normalized.toString()
}

export function normalizeReviewsContent(value: unknown): ReviewsContent {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const usedIds = new Set<string>()
  const items = Array.isArray(source.items)
    ? source.items.slice(0, MAX_REVIEWS).map((value, index): Review | undefined => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return
        const item = value as Record<string, unknown>
        const rawId = textValue(item.id, 80)
        const baseId = /^[a-zA-Z0-9_-]+$/.test(rawId) ? rawId : `review-${index + 1}`
        let id = baseId
        let suffix = 2
        while (usedIds.has(id)) id = `${baseId}-${suffix++}`
        usedIds.add(id)
        const videoUrl = normalizeVkVideoUrl(item.videoUrl)
        const name = textValue(item.name, MAX_NAME_LENGTH)
        if (!videoUrl || !name) return
        return { id, videoUrl, name, subtitle: textValue(item.subtitle, MAX_SUBTITLE_LENGTH) }
      }).filter((item): item is Review => Boolean(item))
    : []
  return { items }
}

export async function readReviewsContent(): Promise<ReviewsContent> {
  const items = await prisma.review.findMany({ orderBy: { sortOrder: 'asc' } })
  return { items: items.map(({ id, videoUrl, name, subtitle }) => ({ id, videoUrl, name, subtitle })) }
}

export async function writeReviewsContent(value: unknown) {
  const sourceItems = value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>).items
    : undefined
  const content = normalizeReviewsContent(value)
  if (!Array.isArray(sourceItems) || content.items.length !== sourceItems.slice(0, MAX_REVIEWS).length) {
    throw createError({ statusCode: 400, statusMessage: 'Проверьте имя и ссылку VK Video в каждом отзыве' })
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.deleteMany()
    if (content.items.length) {
      await tx.review.createMany({
        data: content.items.map((item, sortOrder) => ({ ...item, sortOrder })),
      })
    }
  })
  return content
}
