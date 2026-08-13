export const socialIconNames = ['telegram', 'whatsapp', 'vk', 'youtube'] as const

export type SocialIconName = typeof socialIconNames[number]

export interface SocialLink {
  id: string
  label: string
  href: string
  icon: SocialIconName
  visible: boolean
}

export interface SocialsContent {
  items: SocialLink[]
}

export function createEmptySocialsContent(): SocialsContent {
  return { items: [] }
}
