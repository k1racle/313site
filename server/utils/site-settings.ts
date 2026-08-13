import type { BookingWidgetDefinition, SiteSettings } from '~~/shared/types/site-settings'

const SETTINGS_ID = 'main'
const MAX_WIDGET_CODE_LENGTH = 10000
const DEFAULT_WIDGET_WIDTH = 400
const DEFAULT_WIDGET_HEIGHT = 500

function decodeHtmlAttribute(value: string) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&')
}

function unwrapMarkdownLink(value: string) {
  const match = value.match(/^\[https?:\/\/[^\]]+\]\((https?:\/\/[^)]+)\)$/i)
  return match?.[1] || value
}

function parseDimension(value: string | undefined, fallback: number) {
  if (!value || !/^\d{2,4}$/.test(value)) return fallback
  const dimension = Number(value)
  return dimension >= 100 && dimension <= 2000 ? dimension : fallback
}

export function parseBookingWidgetCode(value: string): BookingWidgetDefinition | null {
  const iframe = value.match(/^\s*<iframe\b([^<>]*)>\s*<\/iframe>\s*$/i)
  if (!iframe?.[1]) return null

  const attributes = new Map<string, string>()
  const attributeSource = iframe[1]
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g
  let cursor = 0
  let attributeMatch: RegExpExecArray | null

  while ((attributeMatch = attributePattern.exec(attributeSource))) {
    if (attributeSource.slice(cursor, attributeMatch.index).trim()) return null
    const name = attributeMatch[1]?.toLowerCase()
    if (name) attributes.set(name, decodeHtmlAttribute(attributeMatch[2] ?? attributeMatch[3] ?? ''))
    cursor = attributePattern.lastIndex
  }

  if (attributeSource.slice(cursor).trim()) return null

  const source = unwrapMarkdownLink(attributes.get('src')?.trim() || '')
  try {
    const url = new URL(source)
    if (url.protocol !== 'https:') return null

    return {
      src: url.toString(),
      width: parseDimension(attributes.get('width'), DEFAULT_WIDGET_WIDTH),
      height: parseDimension(attributes.get('height'), DEFAULT_WIDGET_HEIGHT),
    }
  }
  catch {
    return null
  }
}

function normalizeWidgetCode(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_WIDGET_CODE_LENGTH) : ''
}

export async function readSiteSettings(): Promise<SiteSettings> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } })
  const bookingWidgetCode = settings?.bookingWidgetCode || ''

  return {
    bookingWidgetCode,
    bookingWidget: parseBookingWidgetCode(bookingWidgetCode),
  }
}

export async function writeSiteSettings(value: unknown): Promise<SiteSettings> {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const bookingWidgetCode = normalizeWidgetCode(source.bookingWidgetCode)
  const bookingWidget = bookingWidgetCode ? parseBookingWidgetCode(bookingWidgetCode) : null

  if (bookingWidgetCode && !bookingWidget) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Вставьте корректный iframe с HTTPS-адресом виджета',
    })
  }

  await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { bookingWidgetCode },
    create: { id: SETTINGS_ID, bookingWidgetCode },
  })

  return { bookingWidgetCode, bookingWidget }
}
