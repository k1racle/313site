import {
  AudioLines,
  BadgeRussianRuble,
  CalendarCheck,
  CircleHelp,
  Clapperboard,
  Handshake,
  Info,
  MapPin,
  Newspaper,
  PanelsTopLeft,
  UsersRound,
} from 'lucide-vue-next'
import type { LucideIcon } from 'lucide-vue-next'

export interface NavigationItem {
  label: string
  shortLabel: string
  to: string
  icon: LucideIcon
  description: string
}

export const navigationItems = [
  {
    label: 'О студии',
    shortLabel: 'Студия',
    to: '/about',
    icon: Info,
    description: 'Пространство, команда и подход Studio 313.',
  },
  {
    label: 'Услуги',
    shortLabel: 'Услуги',
    to: '/services',
    icon: Clapperboard,
    description: 'Подкасты, интервью, видео и полный продакшн.',
  },
  {
    label: 'Кейсы',
    shortLabel: 'Кейсы',
    to: '/cases',
    icon: PanelsTopLeft,
    description: 'Проекты, снятые и собранные командой студии.',
  },
  {
    label: 'Цены',
    shortLabel: 'Цены',
    to: '/prices',
    icon: BadgeRussianRuble,
    description: 'Форматы работы и стоимость производства.',
  },
  {
    label: 'Блог',
    shortLabel: 'Блог',
    to: '/blog',
    icon: Newspaper,
    description: 'Новости студии и материалы о производстве контента.',
  },
  {
    label: 'Команда',
    shortLabel: 'Команда',
    to: '/team',
    icon: UsersRound,
    description: 'Люди, которые отвечают за кадр, звук и результат.',
  },
  {
    label: 'Оборудование',
    shortLabel: 'Техника',
    to: '/equipment',
    icon: AudioLines,
    description: 'Камеры, свет и звук Studio 313.',
  },
  {
    label: 'Наши клиенты',
    shortLabel: 'Клиенты',
    to: '/clients',
    icon: Handshake,
    description: 'Бренды и авторы, которые работают со студией.',
  },
  {
    label: 'FAQ',
    shortLabel: 'FAQ',
    to: '/faq',
    icon: CircleHelp,
    description: 'Ответы на частые вопросы о записи и подготовке.',
  },
  {
    label: 'Контакты',
    shortLabel: 'Контакты',
    to: '/contacts',
    icon: MapPin,
    description: 'Адрес студии, телефон и способы связи.',
  },
] as const satisfies readonly NavigationItem[]

export const bookingPage = {
  label: 'Записаться',
  shortLabel: 'Запись',
  to: '/booking',
  icon: CalendarCheck,
  description: 'Выберите удобный способ связи, чтобы запланировать запись.',
} as const satisfies NavigationItem

export const publicPages: readonly NavigationItem[] = [...navigationItems, bookingPage]

export function findPublicPage(slug: string) {
  return publicPages.find(item => item.to === `/${slug}`)
}
