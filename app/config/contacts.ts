import { Mail, MapPin, Phone } from 'lucide-vue-next'
import type { LucideIcon } from 'lucide-vue-next'

export interface ContactItem {
  label: string
  value: string
  href?: string
  icon: LucideIcon
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

export const contactPageSections = [
  {
    id: 'contacts',
    label: 'Связаться',
    waveform: [32, 68, 46, 84, 54, 92, 64, 38, 76, 50, 86, 42],
  },
  {
    id: 'map',
    label: 'На карте',
    waveform: [72, 42, 82, 56, 34, 70, 90, 48, 78, 38, 62, 84],
  },
] as const
