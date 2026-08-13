import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../generated/prisma/client'

const globalForPrisma = globalThis as typeof globalThis & {
  studio313Prisma?: PrismaClient
}

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./data/site.sqlite',
})

export const prisma = globalForPrisma.studio313Prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.studio313Prisma = prisma
