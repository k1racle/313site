import { Mail, MapPin, Phone } from 'lucide-vue-next'
import type { LucideIcon } from 'lucide-vue-next'

export interface ContactItem {
  label: string
  value: string
  href?: string
  icon: LucideIcon
}

export interface SocialLink {
  label: string
  href: string
  icon: 'telegram' | 'whatsapp' | 'vk' | 'youtube'
}

export const contactDetails = {
  email: {
    label: 'Электронная почта',
    value: 'hello@studio313.ru',
    href: 'mailto:hello@studio313.ru',
    icon: Mail,
  },
  phone: {
    label: 'Телефон',
    value: '8 800 222-7-313',
    href: 'tel:+78002227313',
    icon: Phone,
  },
  address: {
    label: 'Адрес',
    value: 'Краснодар, Атарбекова 1/1',
    icon: MapPin,
  },
} as const satisfies Record<string, ContactItem>

export const contactItems: readonly ContactItem[] = Object.values(contactDetails)

export const socialLinks = [
  { label: 'Telegram', href: '#', icon: 'telegram' },
  { label: 'WhatsApp', href: '#', icon: 'whatsapp' },
  { label: 'VK', href: '#', icon: 'vk' },
  { label: 'YouTube', href: '#', icon: 'youtube' },
] as const satisfies readonly SocialLink[]
