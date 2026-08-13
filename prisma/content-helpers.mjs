import { basename, extname } from 'node:path'

const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

export function mediaData(path, defaultAlt = '', size = null) {
  const extension = extname(path).toLowerCase()
  return {
    path,
    filename: basename(path),
    mimeType: mimeTypes[extension] || 'application/octet-stream',
    size,
    defaultAlt,
    storage: path.startsWith('/media/uploads/') ? 'upload' : 'static',
  }
}

export async function ensureMedia(prisma, path, defaultAlt = '', size = null) {
  if (!path) return null
  const data = mediaData(path, defaultAlt, size)
  return prisma.media.upsert({
    where: { path },
    update: {
      filename: data.filename,
      mimeType: data.mimeType,
      size: data.size ?? undefined,
      defaultAlt: defaultAlt || undefined,
      storage: data.storage,
    },
    create: data,
  })
}

export async function createAbout(prisma, content) {
  const existing = await prisma.aboutPage.findUnique({ where: { id: content.id } })
  if (existing) return false

  const sections = []
  for (const [sortOrder, section] of content.sections.entries()) {
    const media = await ensureMedia(prisma, section.image.path, section.image.alt)
    if (media) sections.push({
      id: section.id,
      title: section.title,
      text: section.text,
      mediaId: media.id,
      imageAlt: section.image.alt,
      sortOrder,
    })
  }

  await prisma.aboutPage.create({
    data: {
      id: content.id,
      sections: { create: sections },
    },
  })
  return true
}

export async function createServices(prisma, services) {
  for (const [sortOrder, service] of services.entries()) {
    if (await prisma.featuredService.findUnique({ where: { id: service.id } })) continue
    const media = await ensureMedia(prisma, service.image, service.imageAlt)
    await prisma.featuredService.create({
      data: {
        id: service.id,
        timelineLabel: service.timelineLabel,
        variant: service.variant,
        title: service.title,
        subtitle: service.subtitle,
        price: service.price,
        actionLabel: service.actionLabel,
        imageId: media?.id,
        imageAlt: service.imageAlt,
        sortOrder,
        waveform: { create: service.waveform.map((value, index) => ({ value, sortOrder: index })) },
        features: { create: service.features.map((text, index) => ({ text, sortOrder: index })) },
      },
    })
  }
}

export async function createPriceList(prisma, priceList) {
  if (await prisma.priceListPage.findUnique({ where: { id: priceList.id } })) return false

  await prisma.priceListPage.create({
    data: {
      id: priceList.id,
      title: priceList.title,
      subtitle: priceList.subtitle,
      sections: {
        create: priceList.sections.map((section, sectionOrder) => ({
          id: section.id,
          title: section.title,
          subtitle: section.subtitle,
          sortOrder: sectionOrder,
          items: {
            create: section.items.map((item, itemOrder) => ({
              id: item.id || `${section.id}-item-${itemOrder + 1}`,
              title: item.title,
              subtitle: item.subtitle,
              price: item.price,
              unit: item.unit,
              sortOrder: itemOrder,
              variations: {
                create: (item.variations || []).map((variation, variationOrder) => ({
                  id: variation.id || `${section.id}-item-${itemOrder + 1}-variation-${variationOrder + 1}`,
                  title: variation.title,
                  price: variation.price,
                  sortOrder: variationOrder,
                })),
              },
            })),
          },
        })),
      },
    },
  })
  return true
}
