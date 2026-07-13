export interface RelayPointOpeningSlot {
  day: string
  hours: string
}

export interface RelayPoint {
  id: string
  name: string
  address: string
  zipCode: string
  city: string
  distanceInMeters?: number
  openingHours?: Array<RelayPointOpeningSlot>
}

export interface RelayPointSearchParams {
  zipCode: string
  city: string
  address?: string
  weight?: number
}
