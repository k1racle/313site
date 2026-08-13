export interface HomeMarquee {
  enabled: boolean
  text: string
}

export interface HomeContent {
  introText: string
  marquee: HomeMarquee
}

export function createEmptyHomeContent(): HomeContent {
  return { introText: '', marquee: { enabled: false, text: '' } }
}
