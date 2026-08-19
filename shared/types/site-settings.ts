export interface BookingWidgetDefinition {
  src: string
  title: string
  width: number
  height: number
  minHeight: number
}

export interface SiteSettings {
  bookingWidgetCode: string
  bookingWidget: BookingWidgetDefinition | null
  maintenanceModeEnabled: boolean
}

export function createEmptySiteSettings(): SiteSettings {
  return {
    bookingWidgetCode: '',
    bookingWidget: null,
    maintenanceModeEnabled: false,
  }
}
