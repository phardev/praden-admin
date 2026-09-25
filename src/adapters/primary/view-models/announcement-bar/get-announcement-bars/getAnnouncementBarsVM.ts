import {
  AnnouncementBar,
  isAnnouncementBarEnded,
  isAnnouncementBarStarted
} from '@core/entities/announcementBar'
import { DateProvider } from '@core/gateways/dateProvider'
import { Timestamp } from '@core/types/types'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import { timestampToLocaleString } from '@utils/formatters'

export type AnnouncementBarStatus =
  | 'DISPLAYED'
  | 'MASKED'
  | 'SCHEDULED'
  | 'PAUSED'
  | 'ENDED'

export interface AnnouncementBarMaskedByVM {
  text: string
  endDate: string
}

export interface GetAnnouncementBarsItemVM {
  uuid: string
  text: string
  startDate: string
  endDate: string
  status: AnnouncementBarStatus
  maskedBy?: AnnouncementBarMaskedByVM
}

export interface GetAnnouncementBarsVM {
  displayed?: GetAnnouncementBarsItemVM
  upcoming: Array<GetAnnouncementBarsItemVM>
  ended: Array<GetAnnouncementBarsItemVM>
}

const UPCOMING_STATUS_ORDER: Array<AnnouncementBarStatus> = [
  'MASKED',
  'SCHEDULED',
  'PAUSED'
]

const formatDate = (timestamp?: Timestamp): string =>
  timestamp ? timestampToLocaleString(timestamp, 'fr-FR') : ''

const getStatus = (
  bar: AnnouncementBar,
  displayedUuid: string | undefined,
  now: Timestamp
): AnnouncementBarStatus => {
  if (isAnnouncementBarEnded(bar, now)) return 'ENDED'
  if (bar.uuid === displayedUuid) return 'DISPLAYED'
  if (!bar.isActive) return 'PAUSED'
  if (!isAnnouncementBarStarted(bar, now)) return 'SCHEDULED'
  return 'MASKED'
}

const toMaskedByVM = (
  displayed?: AnnouncementBar
): Pick<GetAnnouncementBarsItemVM, 'maskedBy'> =>
  displayed
    ? {
        maskedBy: {
          text: displayed.text,
          endDate: formatDate(displayed.endDate)
        }
      }
    : {}

const toItemVM = (
  bar: AnnouncementBar,
  status: AnnouncementBarStatus,
  displayed?: AnnouncementBar
): GetAnnouncementBarsItemVM => ({
  uuid: bar.uuid,
  text: bar.text,
  startDate: formatDate(bar.startDate),
  endDate: formatDate(bar.endDate),
  status,
  ...(status === 'MASKED' ? toMaskedByVM(displayed) : {})
})

interface AnnouncementBarWithStatus {
  bar: AnnouncementBar
  status: AnnouncementBarStatus
}

const byUpcomingPriority = (
  a: AnnouncementBarWithStatus,
  b: AnnouncementBarWithStatus
): number => {
  const statusDifference =
    UPCOMING_STATUS_ORDER.indexOf(a.status) -
    UPCOMING_STATUS_ORDER.indexOf(b.status)
  return statusDifference || (a.bar.startDate ?? 0) - (b.bar.startDate ?? 0)
}

const byMostRecentlyEnded = (
  a: AnnouncementBarWithStatus,
  b: AnnouncementBarWithStatus
): number => (b.bar.endDate ?? 0) - (a.bar.endDate ?? 0)

export const getAnnouncementBarsVM = (
  dateProvider: DateProvider
): GetAnnouncementBarsVM => {
  const { items, displayedUuid } = useAnnouncementBarStore()
  const now = dateProvider.now()
  const withStatus = items.map((bar) => ({
    bar,
    status: getStatus(bar, displayedUuid, now)
  }))
  const displayed = withStatus.find(({ status }) => status === 'DISPLAYED')
  const toVM = ({ bar, status }: AnnouncementBarWithStatus) =>
    toItemVM(bar, status, displayed?.bar)

  return {
    displayed: displayed && toVM(displayed),
    upcoming: withStatus
      .filter(({ status }) => UPCOMING_STATUS_ORDER.includes(status))
      .sort(byUpcomingPriority)
      .map(toVM),
    ended: withStatus
      .filter(({ status }) => status === 'ENDED')
      .sort(byMostRecentlyEnded)
      .map(toVM)
  }
}
