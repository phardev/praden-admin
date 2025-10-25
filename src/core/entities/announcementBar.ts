import { Timestamp, UUID } from '@core/types/types'

export interface AnnouncementBar {
  uuid: UUID
  text: string
  order: number
  isActive: boolean
  startDate?: Timestamp
  endDate?: Timestamp
}

export const sortByOrder = (a: any, b: any): number => {
  return a.order - b.order
}

export const isAnnouncementBarStarted = (
  bar: AnnouncementBar,
  now: Timestamp
): boolean => {
  return !bar.startDate ? true : bar.startDate < now
}

export const isAnnouncementBarEnded = (
  bar: AnnouncementBar,
  now: Timestamp
): boolean => {
  return !bar.endDate ? false : now > bar.endDate
}

export const isAnnouncementBarInProgress = (
  bar: AnnouncementBar,
  now: Timestamp
): boolean => {
  return isAnnouncementBarStarted(bar, now) && !isAnnouncementBarEnded(bar, now)
}
