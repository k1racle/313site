import type { HomeContent } from '~~/shared/types/home'

function textValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function normalizeHomeContent(value: unknown): HomeContent {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const marquee = source.marquee && typeof source.marquee === 'object' && !Array.isArray(source.marquee)
    ? source.marquee as Record<string, unknown>
    : {}
  return {
    introText: textValue(source.introText, 2000),
    marquee: { enabled: marquee.enabled === true, text: textValue(marquee.text, 2000) },
  }
}

export async function readHomeContent(): Promise<HomeContent> {
  const home = await prisma.homePage.findUnique({ where: { id: 'main' } })
  if (!home) return { introText: '', marquee: { enabled: false, text: '' } }
  return {
    introText: home.introText,
    marquee: { enabled: home.marqueeEnabled, text: home.marqueeText },
  }
}

export async function writeHomeContent(value: unknown) {
  const content = normalizeHomeContent(value)
  if (!content.introText) throw createError({ statusCode: 400, statusMessage: 'Заполните описание главной страницы' })
  await prisma.homePage.upsert({
    where: { id: 'main' },
    update: {
      introText: content.introText,
      marqueeEnabled: content.marquee.enabled,
      marqueeText: content.marquee.text,
    },
    create: {
      id: 'main',
      introText: content.introText,
      marqueeEnabled: content.marquee.enabled,
      marqueeText: content.marquee.text,
    },
  })
  return content
}
