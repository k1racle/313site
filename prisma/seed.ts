import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../server/generated/prisma/client'
import { about, home, navigation, priceList, reviews, services } from './seed-data.mjs'
import { createAbout, createPriceList, createServices } from './content-helpers.mjs'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./data/site.sqlite',
})
const prisma = new PrismaClient({ adapter })
const SEED_ID = 'initial-content-v1'
const PRICE_LIST_SEED_ID = 'price-list-v1'

async function main() {
  const initialSeedApplied = await prisma.dataMigration.findUnique({ where: { id: SEED_ID } })

  if (!initialSeedApplied) {
    for (const [path, visible] of Object.entries(navigation)) {
      await prisma.navigationItem.upsert({
        where: { path },
        update: {},
        create: { path, visible },
      })
    }

    await createAbout(prisma, about)

    await prisma.homePage.upsert({
      where: { id: home.id },
      update: {},
      create: home,
    })

    for (const [sortOrder, review] of reviews.entries()) {
      await prisma.review.upsert({
        where: { id: review.id },
        update: {},
        create: { ...review, sortOrder },
      })
    }

    await createServices(prisma, services)
    await prisma.dataMigration.create({ data: { id: SEED_ID } })
  }

  if (!await prisma.dataMigration.findUnique({ where: { id: PRICE_LIST_SEED_ID } })) {
    await createPriceList(prisma, priceList)
    await prisma.dataMigration.create({ data: { id: PRICE_LIST_SEED_ID } })
  }
  console.log('Studio 313 seed completed without overwriting existing content.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
