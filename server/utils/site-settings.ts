import type { BookingWidgetDefinition, SiteSettings } from '~~/shared/types/site-settings'

const SETTINGS_ID = 'main'
const MAX_WIDGET_CODE_LENGTH = 10000
const DEFAULT_WIDGET_WIDTH = 400
const DEFAULT_WIDGET_HEIGHT = 760
const DEFAULT_WIDGET_TITLE = 'Онлайн-запись Studio 313'

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

function parsePixelDimension(value: string | undefined, fallback: number) {
  if (!value) return fallback

  const match = value.trim().match(/^(\d{2,4})(?:px)?$/i)
  if (!match?.[1]) return fallback

  const dimension = Number(match[1])
  return dimension >= 100 && dimension <= 2000 ? dimension : fallback
}

function parseInlineStyles(value: string | undefined) {
  const declarations = new Map<string, string>()
  if (!value) return declarations

  for (const declaration of value.split(';')) {
    const separatorIndex = declaration.indexOf(':')
    if (separatorIndex < 0) continue

    const name = declaration.slice(0, separatorIndex).trim().toLowerCase()
    const propertyValue = declaration.slice(separatorIndex + 1).trim()
    if (!name || !propertyValue) continue

    declarations.set(name, decodeHtmlAttribute(propertyValue))
  }

  return declarations
}

export function parseBookingWidgetCode(value: string): BookingWidgetDefinition | null {
  const iframe = value.match(/<iframe\b([\s\S]*?)>\s*<\/iframe>/i)
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

  const styles = parseInlineStyles(attributes.get('style'))
  const source = unwrapMarkdownLink(attributes.get('src')?.trim() || '')

  try {
    const url = new URL(source)
    if (url.protocol !== 'https:') return null

    const minHeight = parsePixelDimension(
      styles.get('min-height') ?? styles.get('height'),
      DEFAULT_WIDGET_HEIGHT,
    )

    return {
      src: url.toString(),
      title: attributes.get('title')?.trim() || DEFAULT_WIDGET_TITLE,
      width: parseDimension(
        attributes.get('width'),
        parsePixelDimension(styles.get('max-width') ?? styles.get('width'), DEFAULT_WIDGET_WIDTH),
      ),
      height: parseDimension(attributes.get('height'), minHeight),
      minHeight,
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
      statusMessage: 'Вставьте корректный код CRM-виджета с iframe и HTTPS-адресом',
    })
  }

  await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { bookingWidgetCode },
    create: { id: SETTINGS_ID, bookingWidgetCode },
  })

  return { bookingWidgetCode, bookingWidget }
}
