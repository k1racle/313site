export interface AboutImage {
  src: string
  alt: string
}

export interface AboutSection {
  id: string
  title: string
  text: string
  image: AboutImage
}

export interface AboutContent {
  sections: AboutSection[]
}

export function createEmptyAboutContent(): AboutContent {
  return { sections: [] }
}
