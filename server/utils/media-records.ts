import { basename, extname } from 'node:path'
import type { Prisma } from '../generated/prisma/client'

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

export async function ensureMediaRecord(
  client: Prisma.TransactionClient,
  path: string,
  options: { alt?: string, mimeType?: string, size?: number } = {},
) {
  const extension = extname(path).toLowerCase()
  const storage = path.startsWith('/media/uploads/') ? 'upload' : 'static'

  return client.media.upsert({
    where: { path },
    update: {
      filename: basename(path),
      mimeType: options.mimeType || mimeTypes[extension] || 'application/octet-stream',
      size: options.size,
      defaultAlt: options.alt || undefined,
      storage,
    },
    create: {
      path,
      filename: basename(path),
      mimeType: options.mimeType || mimeTypes[extension] || 'application/octet-stream',
      size: options.size,
      defaultAlt: options.alt || '',
      storage,
    },
  })
}
