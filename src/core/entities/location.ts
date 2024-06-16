import { UUID } from '@core/types/types'

export interface Location {
  uuid: UUID
  name: string
  order: number
}

export const sortLocationByOrder = (a: any, b: any): number => {
  return a.order < b.order ? -1 : 1
}
