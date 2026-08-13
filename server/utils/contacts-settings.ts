import type { SiteContacts } from '~~/shared/types/contacts'
import { defaultSiteContacts } from '~~/shared/types/contacts'

function textValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function normalizeSiteContacts(value: unknown): SiteContacts {
  const source = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
  return {
    email: textValue(source.email, 320),
    phone: textValue(source.phone, 80),
    phoneHref: textValue(source.phoneHref, 40).replace(/[^+\d]/g, ''),
    address: textValue(source.address, 500),
  }
}

export async function readSiteContacts(): Promise<SiteContacts> {
  const settings = await prisma.contactSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main', ...defaultSiteContacts },
  })
  return normalizeSiteContacts(settings)
}

export async function writeSiteContacts(value: unknown) {
  const contacts = normalizeSiteContacts(value)
  if (!contacts.email || !contacts.phone || !contacts.phoneHref || !contacts.address || !/^\S+@\S+\.\S+$/.test(contacts.email)) {
    throw createError({ statusCode: 400, statusMessage: 'Проверьте телефон, почту и адрес' })
  }
  await prisma.contactSettings.upsert({
    where: { id: 'main' },
    update: contacts,
    create: { id: 'main', ...contacts },
  })
  return contacts
}
