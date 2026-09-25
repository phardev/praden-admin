import { Timestamp, UUID } from '@core/types/types'

export interface AnnouncementBar {
  uuid: UUID
  text: string
  isActive: boolean
  startDate?: Timestamp
  endDate?: Timestamp
}

export interface AnnouncementBarScheduleSegment {
  from: Timestamp
  to: Timestamp
  displayedUuid?: UUID
}

export interface AnnouncementBarSchedule {
  from: Timestamp
  to: Timestamp
  segments: Array<AnnouncementBarScheduleSegment>
}

export const EMPTY_ANNOUNCEMENT_BAR_SCHEDULE: AnnouncementBarSchedule = {
  from: 0,
  to: 0,
  segments: []
}

export interface AnnouncementBarsListing {
  items: Array<AnnouncementBar>
  displayedUuid?: UUID
  schedule: AnnouncementBarSchedule
}

export interface AnnouncementBarImpactPeriod {
  from: Timestamp
  to: Timestamp
  uuid: UUID
  text: string
}

export interface AnnouncementBarImpact {
  replaces: Array<AnnouncementBarImpactPeriod>
  maskedBy: Array<AnnouncementBarImpactPeriod>
}

export const NO_ANNOUNCEMENT_BAR_IMPACT: AnnouncementBarImpact = {
  replaces: [],
  maskedBy: []
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
