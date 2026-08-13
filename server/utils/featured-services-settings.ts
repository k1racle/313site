import type { FeaturedService, FeaturedServiceVariant } from '~~/shared/types/featured-service'
import { ensureMediaRecord } from './media-records'

const variants: FeaturedServiceVariant[] = ['space', 'production', 'distribution']

function text(value: unknown, maxLength = 500) {
  return typeof value === 'string' ? value.slice(0, maxLength).trim() : ''
}

function serviceId(value: unknown, index: number) {
  return text(value, 80).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || `service-${index + 1}`
}

function normalizeService(value: unknown, index: number): FeaturedService {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  const variant = variants.includes(source.variant as FeaturedServiceVariant)
    ? source.variant as FeaturedServiceVariant
    : 'space'
  return {
    id: serviceId(source.id, index),
    timelineLabel: text(source.timelineLabel, 80),
    waveform: Array.isArray(source.waveform)
      ? source.waveform.map(Number).filter(Number.isFinite).map(value => Math.max(0, Math.min(100, Math.round(value)))).slice(0, 24)
      : [],
    variant,
    title: text(source.title, 240),
    subtitle: text(source.subtitle, 1000),
    price: text(source.price, 240),
    actionLabel: text(source.actionLabel, 100),
    image: text(source.image, 500),
    imageAlt: text(source.imageAlt, 240),
    features: Array.isArray(source.features)
      ? source.features.map(item => text(item, 180)).filter(Boolean).slice(0, 40)
      : [],
  }
}

export function normalizeFeaturedServices(value: unknown): FeaturedService[] {
  if (!Array.isArray(value)) return []
  const usedIds = new Set<string>()
  return value.slice(0, 20).map((item, index) => {
    const service = normalizeService(item, index)
    let id = service.id
    let suffix = 2
    while (usedIds.has(id)) id = `${service.id}-${suffix++}`
    usedIds.add(id)
    return { ...service, id }
  })
}

export async function readFeaturedServices(): Promise<FeaturedService[]> {
  const services = await prisma.featuredService.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      image: true,
      waveform: { orderBy: { sortOrder: 'asc' } },
      features: { orderBy: { sortOrder: 'asc' } },
    },
  })
  return services.map(service => ({
    id: service.id,
    timelineLabel: service.timelineLabel,
    waveform: service.waveform.map(bar => bar.value),
    variant: service.variant as FeaturedServiceVariant,
    title: service.title,
    subtitle: service.subtitle,
    price: service.price,
    actionLabel: service.actionLabel,
    image: service.image?.path || '',
    imageAlt: service.imageAlt,
    features: service.features.map(feature => feature.text),
  }))
}

export async function writeFeaturedServices(value: unknown) {
  const services = normalizeFeaturedServices(value)
  if (services.some(service => !service.title || !service.timelineLabel || !service.image)) {
    throw createError({ statusCode: 400, statusMessage: 'Заполните название, подпись таймлайна и изображение каждой услуги' })
  }

  await prisma.$transaction(async (tx) => {
    await tx.featuredService.deleteMany()
    for (const [sortOrder, service] of services.entries()) {
      const media = await ensureMediaRecord(tx, service.image, { alt: service.imageAlt })
      await tx.featuredService.create({
        data: {
          id: service.id,
          timelineLabel: service.timelineLabel,
          variant: service.variant,
          title: service.title,
          subtitle: service.subtitle,
          price: service.price,
          actionLabel: service.actionLabel,
          imageId: media.id,
          imageAlt: service.imageAlt,
          sortOrder,
          waveform: { create: service.waveform.map((value, index) => ({ value, sortOrder: index })) },
          features: { create: service.features.map((text, index) => ({ text, sortOrder: index })) },
        },
      })
    }
  })
  return services
}
