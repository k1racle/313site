import { resolve } from 'node:path'
import type { H3Event } from 'h3'

export function uploadsDirectory(event: H3Event) {
  const configuredDataDir = useRuntimeConfig(event).dataDir || 'data'
  return resolve(process.cwd(), configuredDataDir, 'uploads')
}
