import { Timestamp, UUID } from '@core/types/types'

export interface Banner {
  uuid: UUID
  img: string
  order: number
  isActive: boolean
  href: string
  startDate?: Timestamp
  endDate?: Timestamp
}

export const sortByOrder = (a: any, b: any): number => {
  return a.order - b.order
}

export const isBannerStarted = (b: Banner, now: Timestamp): boolean => {
  return !b.startDate ? true : b.startDate < now
}

export const isBannerEnded = (b: Banner, now: Timestamp): boolean => {
  return !b.endDate ? false : now > b.endDate
}

export const isBannerInProgress = (b: Banner, now: Timestamp): boolean => {
  return isBannerStarted(b, now) && !isBannerEnded(b, now)
}
