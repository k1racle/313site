export interface FaqItem {
  id: string
  question: string
  answer: string
  visible: boolean
}

export interface FaqSection {
  id: string
  title: string
  items: FaqItem[]
}

export interface FaqContent {
  sections: FaqSection[]
}

export function createEmptyFaqContent(): FaqContent {
  return { sections: [] }
}
