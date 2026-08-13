import type { SocialIconName, SocialLink, SocialsContent } from '~~/shared/types/socials'
import { socialIconNames } from '~~/shared/types/socials'

const MAX_SOCIALS = 20
const MAX_LABEL_LENGTH = 80
const MAX_URL_LENGTH = 1000
const iconNames = new Set<string>(socialIconNames)

function textValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function uniqueId(value: unknown, fallback: string, usedIds: Set<string>) {
  const rawId = textValue(value, 80)
  const baseId = /^[a-zA-Z0-9_-]+$/.test(rawId) ? rawId : fallback
  let id = baseId
  let suffix = 2
  while (usedIds.has(id)) id = `${baseId}-${suffix++}`
  usedIds.add(id)
  return id
}

function normalizeHref(value: unknown) {
  const href = textValue(value, MAX_URL_LENGTH)
  if (href === '#') return href
  try {
    const url = new URL(href)
    return url.protocol === 'https:' ? url.toString() : ''
  }
  catch {
    return ''
  }
}

export function normalizeSocialsContent(value: unknown): SocialsContent {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const usedIds = new Set<string>()
  const items = Array.isArray(source.items)
    ? source.items.slice(0, MAX_SOCIALS).map((value, index): SocialLink | undefined => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return
        const item = value as Record<string, unknown>
        const label = textValue(item.label, MAX_LABEL_LENGTH)
        const href = normalizeHref(item.href)
        const icon = textValue(item.icon, 40)
        if (!label || !href || !iconNames.has(icon)) return
        return {
          id: uniqueId(item.id, `social-${index + 1}`, usedIds),
          label,
          href,
          icon: icon as SocialIconName,
          visible: item.visible === true,
        }
      }).filter((item): item is SocialLink => Boolean(item))
    : []
  return { items }
}

export async function readSocialsContent(publicOnly = false): Promise<SocialsContent> {
  const items = await prisma.socialLink.findMany({
    where: publicOnly ? { visible: true } : undefined,
    orderBy: { sortOrder: 'asc' },
  })
  return {
    items: items.map(({ id, label, href, icon, visible }) => ({
      id,
      label,
      href,
      icon: icon as SocialIconName,
      visible,
    })),
  }
}

export async function writeSocialsContent(value: unknown) {
  const sourceItems = value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>).items
    : undefined
  const content = normalizeSocialsContent(value)
  if (!Array.isArray(sourceItems) || sourceItems.length > MAX_SOCIALS || content.items.length !== sourceItems.length) {
    throw createError({ statusCode: 400, statusMessage: 'Проверьте название, HTTPS-ссылку и иконку каждой соцсети' })
  }

  await prisma.$transaction(async (tx) => {
    await tx.socialLink.deleteMany()
    if (content.items.length) {
      await tx.socialLink.createMany({
        data: content.items.map((item, sortOrder) => ({ ...item, sortOrder })),
      })
    }
  })
  return content
}
