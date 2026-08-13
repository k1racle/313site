// Kept as plain ESM so seeding does not depend on a TypeScript runtime.
import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../server/generated/prisma/client.ts'
import { seedData } from './seed-data.mjs'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./data/site.sqlite',
})
const prisma = new PrismaClient({ adapter })
const SEED_ID = 'initial-content-v1'
const PRICE_LIST_SEED_ID = 'price-list-v1'

async function assertDatabaseIsReadyForInitialSeed() {
  const counts = await Promise.all([
    prisma.media.count(),
    prisma.blogPost.count(),
    prisma.contactSettings.count(),
    prisma.siteSettings.count(),
    prisma.aboutPage.count(),
    prisma.homePage.count(),
    prisma.navigationItem.count(),
    prisma.review.count(),
    prisma.featuredService.count(),
    prisma.priceListPage.count(),
  ])

  if (counts.some(Boolean)) {
    throw new Error('Initial seed refused: the database already contains content but has no seed marker.')
  }
}

async function main() {
  if (await prisma.dataMigration.findUnique({ where: { id: SEED_ID } })) {
    console.log('Studio 313 initial seed already applied.')
    return
  }

  await assertDatabaseIsReadyForInitialSeed()

  await prisma.$transaction(async (tx) => {
    // The initial migration contains fallback FAQ/social rows. The exported
    // snapshot is authoritative when a clean database is explicitly seeded.
    await tx.faqItem.deleteMany()
    await tx.faqSection.deleteMany()
    await tx.socialLink.deleteMany()

    if (seedData.media.length) await tx.media.createMany({ data: seedData.media })
    if (seedData.aboutPages.length) await tx.aboutPage.createMany({ data: seedData.aboutPages })
    if (seedData.homePages.length) await tx.homePage.createMany({ data: seedData.homePages })
    if (seedData.navigationItems.length) await tx.navigationItem.createMany({ data: seedData.navigationItems })
    if (seedData.reviews.length) await tx.review.createMany({ data: seedData.reviews })
    if (seedData.featuredServices.length) await tx.featuredService.createMany({ data: seedData.featuredServices })
    if (seedData.priceListPages.length) await tx.priceListPage.createMany({ data: seedData.priceListPages })
    if (seedData.blogPosts.length) {
      await tx.blogPost.createMany({
        data: seedData.blogPosts.map(post => ({
          ...post,
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
        })),
      })
    }
    if (seedData.contactSettings.length) await tx.contactSettings.createMany({ data: seedData.contactSettings })
    if (seedData.siteSettings.length) await tx.siteSettings.createMany({ data: seedData.siteSettings })
    if (seedData.socialLinks.length) await tx.socialLink.createMany({ data: seedData.socialLinks })
    if (seedData.faqSections.length) await tx.faqSection.createMany({ data: seedData.faqSections })

    if (seedData.aboutSections.length) await tx.aboutSection.createMany({ data: seedData.aboutSections })
    if (seedData.serviceWaveformBars.length) await tx.serviceWaveformBar.createMany({ data: seedData.serviceWaveformBars })
    if (seedData.serviceFeatures.length) await tx.serviceFeature.createMany({ data: seedData.serviceFeatures })
    if (seedData.priceListSections.length) await tx.priceListSection.createMany({ data: seedData.priceListSections })
    if (seedData.priceListItems.length) await tx.priceListItem.createMany({ data: seedData.priceListItems })
    if (seedData.priceListVariations.length) await tx.priceListVariation.createMany({ data: seedData.priceListVariations })
    if (seedData.blogSections.length) await tx.blogSection.createMany({ data: seedData.blogSections })
    if (seedData.faqItems.length) await tx.faqItem.createMany({ data: seedData.faqItems })

    await tx.dataMigration.create({ data: { id: SEED_ID } })
    await tx.dataMigration.upsert({
      where: { id: PRICE_LIST_SEED_ID },
      update: {},
      create: { id: PRICE_LIST_SEED_ID },
    })
  })

  console.log('Studio 313 initial content snapshot seeded.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
