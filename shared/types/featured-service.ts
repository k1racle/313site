export type FeaturedServiceVariant = 'space' | 'production' | 'distribution'

export interface FeaturedService {
  id: string
  timelineLabel: string
  waveform: number[]
  variant: FeaturedServiceVariant
  title: string
  subtitle: string
  price: string
  actionLabel: string
  image: string
  imageAlt: string
  features: string[]
}

export function createEmptyFeaturedService(id: string): FeaturedService {
  return {
    id,
    timelineLabel: '',
    waveform: [],
    variant: 'space',
    title: '',
    subtitle: '',
    price: '',
    actionLabel: '',
    image: '',
    imageAlt: '',
    features: [],
  }
}
