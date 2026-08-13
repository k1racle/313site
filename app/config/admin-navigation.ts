import {
  BadgeRussianRuble,
  BookOpenText,
  CircleHelp,
  FolderKanban,
  House,
  Info,
  LayoutDashboard,
  ListTree,
  MessageSquareQuote,
  ReceiptText,
  Settings,
  Share2,
} from 'lucide-vue-next'

export const adminNavigation = [
  {
    label: 'Обзор',
    description: 'Состояние контентных разделов',
    to: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Главная',
    description: 'Первый экран и бегущая строка',
    to: '/admin/home',
    icon: House,
  },
  {
    label: 'Меню',
    description: 'Видимость разделов сайта',
    to: '/admin/navigation',
    icon: ListTree,
  },
  {
    label: 'О студии',
    description: 'Смысловые секции и фотографии',
    to: '/admin/about',
    icon: Info,
  },
  {
    label: 'Услуги',
    description: 'Большие полноэкранные услуги',
    to: '/admin/services',
    icon: BadgeRussianRuble,
  },
  {
    label: 'Прайс-лист',
    description: 'Секции, позиции, цены и вариации',
    to: '/admin/prices',
    icon: ReceiptText,
  },
  {
    label: 'Кейсы',
    description: 'Проекты студии',
    to: '/admin/cases',
    icon: FolderKanban,
  },
  {
    label: 'Отзывы',
    description: 'Видеоотзывы клиентов',
    to: '/admin/reviews',
    icon: MessageSquareQuote,
  },
  {
    label: 'Блог',
    description: 'Статьи и публикации',
    to: '/admin/blog',
    icon: BookOpenText,
  },
  {
    label: 'FAQ',
    description: 'Вопросы и ответы',
    to: '/admin/faq',
    icon: CircleHelp,
  },
  {
    label: 'Контакты',
    description: 'Телефон, почта, адрес и соцсети',
    to: '/admin/socials',
    icon: Share2,
  },
  {
    label: 'Настройки',
    description: 'Интеграции и общие параметры сайта',
    to: '/admin/settings',
    icon: Settings,
  },
] as const
