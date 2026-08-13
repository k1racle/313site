import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { constants } from 'node:fs'
import { access, copyFile, mkdir, readFile, readdir, stat } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { PrismaClient } from '../server/generated/prisma/client'
import { ensureMedia } from './content-helpers.mjs'

const MIGRATION_ID = 'legacy-json-v1'
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./data/site.sqlite',
})
const prisma = new PrismaClient({ adapter })
const dataDirectory = resolve(process.cwd(), process.env.DATA_DIR || 'data')
const uploadsDirectory = resolve(dataDirectory, 'uploads')

async function readJson(name: string) {
  try {
    return JSON.parse(await readFile(resolve(dataDirectory, name), 'utf8')) as Record<string, unknown>
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

function string(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function mediaPath(value: unknown) {
  const path = string(value)
  return /^\/media\/(?:uploads|photos|static)\/[a-zA-Z0-9_./-]+$/.test(path) && !path.includes('..') ? path : ''
}

async function importMediaDirectory(directory: string) {
  try { await access(directory) }
  catch { return }

  await mkdir(uploadsDirectory, { recursive: true })
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !/^\.(?:jpe?g|png|webp|avif|svg)$/i.test(extname(entry.name))) continue
    const sourcePath = resolve(directory, entry.name)
    const targetPath = resolve(uploadsDirectory, entry.name)
    if (sourcePath !== targetPath) {
      try { await copyFile(sourcePath, targetPath, constants.COPYFILE_EXCL) }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
      }
    }
    const file = await stat(targetPath)
    await ensureMedia(prisma, `/media/uploads/${entry.name}`, '', file.size)
  }
}

async function importNavigation() {
  const source = await readJson('navigation.json')
  const visibility = source?.visibility
  if (!visibility || typeof visibility !== 'object' || Array.isArray(visibility)) return
  for (const [path, visible] of Object.entries(visibility)) {
    if (typeof visible !== 'boolean') continue
    await prisma.navigationItem.upsert({ where: { path }, update: { visible }, create: { path, visible } })
  }
}

async function importHome() {
  const source = await readJson('home.json')
  if (!source) return
  const marquee = source.marquee && typeof source.marquee === 'object' && !Array.isArray(source.marquee)
    ? source.marquee as Record<string, unknown>
    : {}
  const introText = string(source.introText)
  if (!introText) return
  await prisma.homePage.upsert({
    where: { id: 'main' },
    update: { introText, marqueeEnabled: marquee.enabled === true, marqueeText: string(marquee.text) },
    create: { id: 'main', introText, marqueeEnabled: marquee.enabled === true, marqueeText: string(marquee.text) },
  })
}

function normalizeAboutSections(source: Record<string, unknown>) {
  if (Array.isArray(source.sections)) {
    return source.sections.map((value, index) => {
      const section = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
      const image = section.image && typeof section.image === 'object' && !Array.isArray(section.image)
        ? section.image as Record<string, unknown>
        : {}
      return {
        id: string(section.id) || `section-${index + 1}`,
        title: string(section.title),
        text: string(section.text),
        image: { path: mediaPath(image.src), alt: string(image.alt) },
      }
    }).filter(section => section.title && section.text && section.image.path)
  }

  const paragraphs = string(source.text).split(/\n\s*\n/).map(value => value.trim()).filter(Boolean)
  const images = Array.isArray(source.images)
    ? source.images.map((value) => {
        const image = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
        return { path: mediaPath(image.src), alt: string(image.alt) }
      }).filter(image => image.path)
    : []
  if (!paragraphs.length || !images.length) return []
  return paragraphs.map((text, index) => ({
    id: `section-${index + 1}`,
    title: index === 0 ? string(source.title) || 'О студии' : `Studio 313 / ${String(index + 1).padStart(2, '0')}`,
    text,
    image: images[index % images.length]!,
  }))
}

async function importAbout() {
  const source = await readJson('about.json')
  if (!source) return
  const sections = normalizeAboutSections(source)
  if (!sections.length) return

  await prisma.$transaction(async (tx) => {
    await tx.aboutPage.upsert({ where: { id: 'main' }, update: {}, create: { id: 'main' } })
    await tx.aboutSection.deleteMany({ where: { pageId: 'main' } })
    for (const [sortOrder, section] of sections.entries()) {
      const media = await ensureMedia(tx, section.image.path, section.image.alt)
      await tx.aboutSection.create({
        data: {
          id: section.id,
          pageId: 'main',
          title: section.title,
          text: section.text,
          mediaId: media.id,
          imageAlt: section.image.alt,
          sortOrder,
        },
      })
    }
  })
}

async function importReviews() {
  const source = await readJson('reviews.json')
  if (!source || !Array.isArray(source.items)) return
  const items = source.items.map((value, index) => {
    const item = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
    return {
      id: string(item.id) || `review-${index + 1}`,
      videoUrl: string(item.videoUrl),
      name: string(item.name),
      subtitle: string(item.subtitle),
      sortOrder: index,
    }
  }).filter(item => item.videoUrl && item.name)

  await prisma.$transaction(async (tx) => {
    await tx.review.deleteMany()
    if (items.length) await tx.review.createMany({ data: items })
  })
}

async function importServices() {
  const source = await readJson('featured-services.json')
  if (!source || !Array.isArray(source.services)) return
  const services = source.services

  await prisma.$transaction(async (tx) => {
    await tx.featuredService.deleteMany()
    for (const [sortOrder, value] of services.entries()) {
      const service = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
      const id = string(service.id) || `service-${sortOrder + 1}`
      const imagePath = mediaPath(service.image)
      if (!imagePath || !string(service.title)) continue
      const media = await ensureMedia(tx, imagePath, string(service.imageAlt))
      const waveform = Array.isArray(service.waveform) ? service.waveform.map(Number).filter(Number.isFinite) : []
      const features = Array.isArray(service.features) ? service.features.map(string).filter(Boolean) : []
      await tx.featuredService.create({
        data: {
          id,
          timelineLabel: string(service.timelineLabel) || string(service.title).split(/\r?\n/)[0] || id,
          variant: string(service.variant) || 'space',
          title: string(service.title),
          subtitle: string(service.subtitle),
          price: string(service.price),
          actionLabel: string(service.actionLabel),
          imageId: media.id,
          imageAlt: string(service.imageAlt),
          sortOrder,
          waveform: { create: waveform.map((value, index) => ({ value: Math.round(value), sortOrder: index })) },
          features: { create: features.map((text, index) => ({ text, sortOrder: index })) },
        },
      })
    }
  })
}

async function main() {
  await importMediaDirectory(resolve(process.cwd(), 'public', 'media', 'uploads'))
  await importMediaDirectory(resolve(process.cwd(), '.output', 'public', 'media', 'uploads'))
  await importMediaDirectory(uploadsDirectory)

  if (await prisma.dataMigration.findUnique({ where: { id: MIGRATION_ID } })) {
    console.log('Legacy JSON import already applied.')
    return
  }

  await importNavigation()
  await importHome()
  await importAbout()
  await importReviews()
  await importServices()
  await prisma.dataMigration.create({ data: { id: MIGRATION_ID } })
  console.log('Legacy JSON content imported into Prisma.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
