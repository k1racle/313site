export type CaseCategoryId = 'video' | 'gallery' | 'podcasts'

export interface CaseProject {
  title: string
  description: string
  image: string
  imageAlt: string
  layout: 'feature' | 'portrait' | 'wide'
}

export interface CaseCategory {
  id: CaseCategoryId
  title: string
  shortTitle: string
  eyebrow: string
  description: string
  image: string
  imageAlt: string
  projects: readonly CaseProject[]
}
