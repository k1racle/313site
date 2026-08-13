export interface BookingWidgetDefinition {
  src: string
  width: number
  height: number
}

export interface SiteSettings {
  bookingWidgetCode: string
  bookingWidget: BookingWidgetDefinition | null
}

export function createEmptySiteSettings(): SiteSettings {
  return {
    bookingWidgetCode: '',
    bookingWidget: null,
  }
}
