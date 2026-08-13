import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const ADMIN_SESSION_COOKIE = 'studio313_admin_session'
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8

function digest(value: string) {
  return createHmac('sha256', 'studio313-admin-password-comparison')
    .update(value)
    .digest()
}

function sign(expiresAt: string, secret: string) {
  return createHmac('sha256', secret)
    .update(expiresAt)
    .digest('base64url')
}

function isHttpsRequest(event: H3Event) {
  return getHeader(event, 'x-forwarded-proto')?.split(',')[0]?.trim() === 'https'
}

export function isValidAdminPassword(password: string, expectedPassword: string) {
  return timingSafeEqual(digest(password), digest(expectedPassword))
}

export function createAdminSession(event: H3Event) {
  const config = useRuntimeConfig(event)
  const expiresAt = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS)
  const value = `${expiresAt}.${sign(expiresAt, config.adminSessionSecret)}`

  setCookie(event, ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    maxAge: ADMIN_SESSION_TTL_SECONDS,
    path: '/',
    sameSite: 'lax',
    secure: isHttpsRequest(event),
  })
}

export function clearAdminSession(event: H3Event) {
  deleteCookie(event, ADMIN_SESSION_COOKIE, {
    path: '/',
    sameSite: 'lax',
    secure: isHttpsRequest(event),
  })
}

export function hasAdminSession(event: H3Event) {
  const value = getCookie(event, ADMIN_SESSION_COOKIE)

  if (!value) {
    return false
  }

  const [expiresAt, signature] = value.split('.')
  const expiresAtNumber = Number(expiresAt)

  if (!expiresAt || !signature || !Number.isSafeInteger(expiresAtNumber)) {
    return false
  }

  if (expiresAtNumber <= Math.floor(Date.now() / 1000)) {
    return false
  }

  const config = useRuntimeConfig(event)
  const expectedSignature = sign(expiresAt, config.adminSessionSecret)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  return actualBuffer.length === expectedBuffer.length
    && timingSafeEqual(actualBuffer, expectedBuffer)
}

export function requireAdminSession(event: H3Event) {
  if (!hasAdminSession(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Требуется вход в админку',
    })
  }
}
