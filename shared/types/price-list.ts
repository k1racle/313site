export interface PriceListVariation {
  id: string
  title: string
  price: string
}

export interface PriceListItem {
  id: string
  title: string
  subtitle: string
  price: string
  unit: string
  variations: PriceListVariation[]
}

export interface PriceListSection {
  id: string
  title: string
  subtitle: string
  items: PriceListItem[]
}

export interface PriceList {
  id: string
  title: string
  subtitle: string
  sections: PriceListSection[]
}

export function createEmptyPriceListVariation(id: string): PriceListVariation {
  return { id, title: '', price: '' }
}

export function createEmptyPriceListItem(id: string): PriceListItem {
  return {
    id,
    title: '',
    subtitle: '',
    price: '',
    unit: '',
    variations: [],
  }
}

export function createEmptyPriceListSection(id: string): PriceListSection {
  return {
    id,
    title: '',
    subtitle: '',
    items: [],
  }
}
