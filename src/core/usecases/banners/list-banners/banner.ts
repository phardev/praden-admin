import { UUID } from '@core/types/types'

export interface Banner {
  uuid: UUID
  img: string
  order: number
}

export const sortByOrder = (a: any, b: any): number => {
  return a.order < b.order ? -1 : 1
}
