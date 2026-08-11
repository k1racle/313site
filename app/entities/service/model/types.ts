export type FeaturedServiceVariant = 'space' | 'production' | 'distribution'

export interface FeaturedService {
  id: string
  timelineLabel: string
  waveform: readonly number[]
  variant: FeaturedServiceVariant
  code: string
  camera: string
  title: string
  titleAccent: string
  description: string
  price: string
  priceUnit: string
  action: string
  query: string
  image: string
  imageAlt: string
  features: readonly string[]
}

export interface ServicePriceItem {
  title: string
  detail: string
  price: string
  unit: string
}

export interface ServicePriceGroup {
  id: string
  number: string
  title: string
  note: string
  items: readonly ServicePriceItem[]
}
