import type { NavigationItem } from '~/shared/types/navigation'

export const navigationItems: NavigationItem[] = [
  {
    label: 'О студии',
    shortLabel: 'Студия',
    to: '/about',
    icon: 'lucide:info',
    description: 'Пространство, команда и подход Studio 313.',
  },
  {
    label: 'Услуги',
    shortLabel: 'Услуги',
    to: '/services',
    icon: 'lucide:clapperboard',
    description: 'Подкасты, интервью, видео и полный продакшн.',
  },
  {
    label: 'Кейсы',
    shortLabel: 'Кейсы',
    to: '/cases',
    icon: 'lucide:panels-top-left',
    description: 'Проекты, снятые и собранные командой студии.',
  },
  {
    label: 'Цены',
    shortLabel: 'Цены',
    to: '/prices',
    icon: 'lucide:badge-russian-ruble',
    description: 'Форматы работы и стоимость производства.',
  },
  {
    label: 'Блог',
    shortLabel: 'Блог',
    to: '/blog',
    icon: 'lucide:newspaper',
    description: 'Новости студии и материалы о производстве контента.',
  },
  {
    label: 'Команда',
    shortLabel: 'Команда',
    to: '/team',
    icon: 'lucide:users-round',
    description: 'Люди, которые отвечают за кадр, звук и результат.',
  },
  {
    label: 'Оборудование',
    shortLabel: 'Техника',
    to: '/equipment',
    icon: 'lucide:audio-lines',
    description: 'Камеры, свет и звук Studio 313.',
  },
  {
    label: 'Наши клиенты',
    shortLabel: 'Клиенты',
    to: '/clients',
    icon: 'lucide:handshake',
    description: 'Бренды и авторы, которые работают со студией.',
  },
  {
    label: 'FAQ',
    shortLabel: 'FAQ',
    to: '/faq',
    icon: 'lucide:circle-help',
    description: 'Ответы на частые вопросы о записи и подготовке.',
  },
  {
    label: 'Контакты',
    shortLabel: 'Контакты',
    to: '/contacts',
    icon: 'lucide:map-pin',
    description: 'Адрес студии, телефон и способы связи.',
  },
]

export const bookingPage: NavigationItem = {
  label: 'Записаться',
  shortLabel: 'Запись',
  to: '/booking',
  icon: 'lucide:calendar-check',
  description: 'Выберите удобный способ связи, чтобы запланировать запись.',
}

export const publicPages = [...navigationItems, bookingPage]

export function findPublicPage(slug: string) {
  return publicPages.find(item => item.to === `/${slug}`)
}
