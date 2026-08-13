import { randomUUID } from 'node:crypto'
import { mkdir, rename, unlink, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { ensureMediaRecord } from '../../../utils/media-records'

const MAX_IMAGE_SIZE = 12 * 1024 * 1024
const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
])

function hasExpectedSignature(type: string, data: Buffer) {
  if (type === 'image/jpeg') return data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff
  if (type === 'image/png') return data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (type === 'image/webp') return data.subarray(0, 4).toString('ascii') === 'RIFF' && data.subarray(8, 12).toString('ascii') === 'WEBP'
  if (type === 'image/avif') {
    const box = data.subarray(4, Math.min(data.length, 32)).toString('ascii')
    return box.startsWith('ftyp') && (box.includes('avif') || box.includes('avis'))
  }
  return false
}

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const contentLength = Number(getRequestHeader(event, 'content-length') || 0)
  if (contentLength > MAX_IMAGE_SIZE + 1024 * 1024) {
    throw createError({ statusCode: 413, statusMessage: 'Размер изображения не должен превышать 12 МБ' })
  }

  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'image' && part.filename)

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Изображение не выбрано' })
  }

  const extension = allowedTypes.get(file.type || '')
  if (!extension) {
    throw createError({ statusCode: 415, statusMessage: 'Допустимы JPG, PNG, WebP и AVIF' })
  }

  if (!file.data.length || file.data.length > MAX_IMAGE_SIZE) {
    throw createError({ statusCode: 413, statusMessage: 'Размер изображения не должен превышать 12 МБ' })
  }

  if (!hasExpectedSignature(file.type || '', file.data)) {
    throw createError({ statusCode: 415, statusMessage: 'Содержимое файла не соответствует формату изображения' })
  }

  const directory = uploadsDirectory(event)
  const filename = `${Date.now()}-${randomUUID()}.${extension}`
  const target = resolve(directory, filename)
  const temporaryTarget = `${target}.${process.pid}.tmp`

  await mkdir(directory, { recursive: true })
  await writeFile(temporaryTarget, file.data, { flag: 'wx' })
  await rename(temporaryTarget, target)

  const src = `/media/uploads/${filename}`
  try {
    await prisma.$transaction(tx => ensureMediaRecord(tx, src, {
      mimeType: file.type,
      size: file.data.length,
    }))
  }
  catch (error) {
    await unlink(target).catch(() => undefined)
    throw error
  }

  return {
    src,
    alt: '',
  }
})
