export interface SiteContacts {
  email: string
  phone: string
  phoneHref: string
  address: string
}

export const defaultSiteContacts: SiteContacts = {
  email: 'hello@studio313.ru',
  phone: '8 800 222-7-313',
  phoneHref: '+78002227313',
  address: 'Краснодар, Атарбекова 1/1',
}

export function createDefaultSiteContacts(): SiteContacts {
  return { ...defaultSiteContacts }
}
