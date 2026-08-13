import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'

const contentTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
}

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename') || ''
  if (!filename || basename(filename) !== filename || !/^[a-zA-Z0-9_.-]+$/.test(filename)) {
    throw createError({ statusCode: 404, statusMessage: 'Изображение не найдено' })
  }

  const extension = extname(filename).toLowerCase()
  const contentType = contentTypes[extension]
  if (!contentType) {
    throw createError({ statusCode: 404, statusMessage: 'Изображение не найдено' })
  }

  const candidates = [
    resolve(uploadsDirectory(event), filename),
    resolve(process.cwd(), 'public', 'media', 'uploads', filename),
    resolve(process.cwd(), '.output', 'public', 'media', 'uploads', filename),
  ]

  for (const target of candidates) {
    try {
      const file = await stat(target)
      if (!file.isFile()) continue

      setResponseHeaders(event, {
        'Content-Type': contentType,
        'Content-Length': String(file.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
      })

      return sendStream(event, createReadStream(target))
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
  }

  throw createError({ statusCode: 404, statusMessage: 'Изображение не найдено' })
})
