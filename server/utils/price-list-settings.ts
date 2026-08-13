import type {
  PriceList,
  PriceListItem,
  PriceListSection,
  PriceListVariation,
} from '~~/shared/types/price-list'

function text(value: unknown, maxLength = 1000) {
  return typeof value === 'string' ? value.slice(0, maxLength).trim() : ''
}

function identifier(value: unknown, fallback: string) {
  return text(value, 100)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallback
}

function uniqueId(preferred: string, usedIds: Set<string>) {
  let id = preferred
  let suffix = 2
  while (usedIds.has(id)) id = `${preferred}-${suffix++}`
  usedIds.add(id)
  return id
}

function normalizeVariation(value: unknown, index: number, itemId: string, usedIds: Set<string>): PriceListVariation {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  return {
    id: uniqueId(identifier(source.id, `${itemId}-variation-${index + 1}`), usedIds),
    title: text(source.title, 180),
    price: text(source.price, 180),
  }
}

function normalizeItem(value: unknown, index: number, sectionId: string, usedIds: Set<string>): PriceListItem {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const id = uniqueId(identifier(source.id, `${sectionId}-item-${index + 1}`), usedIds)
  return {
    id,
    title: text(source.title, 240),
    subtitle: text(source.subtitle, 1000),
    price: text(source.price, 240),
    unit: text(source.unit, 120),
    variations: Array.isArray(source.variations)
      ? source.variations.slice(0, 20).map((variation, variationIndex) => normalizeVariation(variation, variationIndex, id, usedIds))
      : [],
  }
}

function normalizeSection(value: unknown, index: number, usedIds: Set<string>): PriceListSection {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const id = uniqueId(identifier(source.id, `price-section-${index + 1}`), usedIds)
  return {
    id,
    title: text(source.title, 240),
    subtitle: text(source.subtitle, 1000),
    items: Array.isArray(source.items)
      ? source.items.slice(0, 100).map((item, itemIndex) => normalizeItem(item, itemIndex, id, usedIds))
      : [],
  }
}

export function normalizePriceList(value: unknown): PriceList {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const usedIds = new Set<string>()
  return {
    id: 'main',
    title: text(source.title, 240) || 'Прайс-лист',
    subtitle: text(source.subtitle, 1000),
    sections: Array.isArray(source.sections)
      ? source.sections.slice(0, 30).map((section, index) => normalizeSection(section, index, usedIds))
      : [],
  }
}

export async function readPriceList(): Promise<PriceList> {
  const page = await prisma.priceListPage.findUnique({
    where: { id: 'main' },
    include: {
      sections: {
        orderBy: { sortOrder: 'asc' },
        include: {
          items: {
            orderBy: { sortOrder: 'asc' },
            include: { variations: { orderBy: { sortOrder: 'asc' } } },
          },
        },
      },
    },
  })

  if (!page) return { id: 'main', title: 'Прайс-лист', subtitle: '', sections: [] }
  return {
    id: page.id,
    title: page.title,
    subtitle: page.subtitle,
    sections: page.sections.map(section => ({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      items: section.items.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        price: item.price,
        unit: item.unit,
        variations: item.variations.map(variation => ({
          id: variation.id,
          title: variation.title,
          price: variation.price,
        })),
      })),
    })),
  }
}

export async function writePriceList(value: unknown): Promise<PriceList> {
  const priceList = normalizePriceList(value)
  if (priceList.sections.some(section => !section.title || section.items.some(item => !item.title))) {
    throw createError({ statusCode: 400, statusMessage: 'Укажите заголовки всех секций и позиций прайс-листа' })
  }
  if (priceList.sections.some(section => section.items.some(item => item.variations.some(variation => !variation.title || !variation.price)))) {
    throw createError({ statusCode: 400, statusMessage: 'Заполните название и цену каждой вариации' })
  }

  await prisma.$transaction(async (tx) => {
    await tx.priceListPage.upsert({
      where: { id: priceList.id },
      update: { title: priceList.title, subtitle: priceList.subtitle },
      create: { id: priceList.id, title: priceList.title, subtitle: priceList.subtitle },
    })
    await tx.priceListSection.deleteMany({ where: { pageId: priceList.id } })

    for (const [sectionOrder, section] of priceList.sections.entries()) {
      await tx.priceListSection.create({
        data: {
          id: section.id,
          pageId: priceList.id,
          title: section.title,
          subtitle: section.subtitle,
          sortOrder: sectionOrder,
          items: {
            create: section.items.map((item, itemOrder) => ({
              id: item.id,
              title: item.title,
              subtitle: item.subtitle,
              price: item.price,
              unit: item.unit,
              sortOrder: itemOrder,
              variations: {
                create: item.variations.map((variation, variationOrder) => ({
                  id: variation.id,
                  title: variation.title,
                  price: variation.price,
                  sortOrder: variationOrder,
                })),
              },
            })),
          },
        },
      })
    }
  })
  return priceList
}
