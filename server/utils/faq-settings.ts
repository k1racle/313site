import type { FaqContent, FaqItem, FaqSection } from '~~/shared/types/faq'

const MAX_SECTIONS = 30
const MAX_ITEMS_PER_SECTION = 100
const MAX_TITLE_LENGTH = 160
const MAX_QUESTION_LENGTH = 500
const MAX_ANSWER_LENGTH = 10000

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

export function normalizeFaqContent(value: unknown): FaqContent {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const usedSectionIds = new Set<string>()
  const usedItemIds = new Set<string>()
  const sections = Array.isArray(source.sections)
    ? source.sections.slice(0, MAX_SECTIONS).map((value, sectionIndex): FaqSection | undefined => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return
        const section = value as Record<string, unknown>
        const title = textValue(section.title, MAX_TITLE_LENGTH)
        if (!title || !Array.isArray(section.items) || section.items.length > MAX_ITEMS_PER_SECTION) return
        const items = section.items.map((value, itemIndex): FaqItem | undefined => {
          if (!value || typeof value !== 'object' || Array.isArray(value)) return
          const item = value as Record<string, unknown>
          const question = textValue(item.question, MAX_QUESTION_LENGTH)
          const answer = textValue(item.answer, MAX_ANSWER_LENGTH)
          if (!question || !answer) return
          return {
            id: uniqueId(item.id, `faq-${sectionIndex + 1}-${itemIndex + 1}`, usedItemIds),
            question,
            answer,
            visible: item.visible === true,
          }
        }).filter((item): item is FaqItem => Boolean(item))
        if (items.length !== section.items.length) return
        return {
          id: uniqueId(section.id, `faq-section-${sectionIndex + 1}`, usedSectionIds),
          title,
          items,
        }
      }).filter((section): section is FaqSection => Boolean(section))
    : []
  return { sections }
}

export async function readFaqContent(publicOnly = false): Promise<FaqContent> {
  const sections = await prisma.faqSection.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: publicOnly ? { visible: true } : undefined,
        orderBy: { sortOrder: 'asc' },
      },
    },
  })
  return {
    sections: sections
      .map(section => ({
        id: section.id,
        title: section.title,
        items: section.items.map(({ id, question, answer, visible }) => ({ id, question, answer, visible })),
      }))
      .filter(section => !publicOnly || section.items.length > 0),
  }
}

export async function writeFaqContent(value: unknown) {
  const sourceSections = value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>).sections
    : undefined
  const content = normalizeFaqContent(value)
  if (!Array.isArray(sourceSections) || sourceSections.length > MAX_SECTIONS || content.sections.length !== sourceSections.length) {
    throw createError({ statusCode: 400, statusMessage: 'Заполните названия разделов, вопросы и ответы' })
  }

  await prisma.$transaction(async (tx) => {
    await tx.faqSection.deleteMany()
    for (const [sortOrder, section] of content.sections.entries()) {
      await tx.faqSection.create({
        data: {
          id: section.id,
          title: section.title,
          visible: true,
          sortOrder,
          items: {
            create: section.items.map((item, itemSortOrder) => ({ ...item, sortOrder: itemSortOrder })),
          },
        },
      })
    }
  })
  return content
}
