import type { SocialLink } from '~/shared/types/navigation'

export const siteContact = {
  email: 'hello@studio313.ru',
  phone: '8 800 222-7-313',
  phoneHref: 'tel:+79990000000',
  address: 'Краснодар, Атарбекова 1/1',
} as const

export const socialLinks: SocialLink[] = [
  { label: 'Telegram', href: '#', icon: 'lucide:send' },
  { label: 'WhatsApp', href: '#', icon: 'lucide:message-circle' },
  { label: 'VK', href: '#', icon: 'lucide:users' },
  { label: 'YouTube', href: '#', icon: 'lucide:play' },
]
