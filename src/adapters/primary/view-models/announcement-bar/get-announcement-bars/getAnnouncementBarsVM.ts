import { DateProvider } from '@core/gateways/dateProvider'
import { HashTable, Timestamp } from '@core/types/types'
import { useAnnouncementBarStore } from '@store/announcementBarStore'
import {
  AnnouncementBar,
  isAnnouncementBarEnded,
  isAnnouncementBarInProgress,
  isAnnouncementBarStarted,
  sortByOrder
} from '@core/entities/announcementBar'
import { timestampToLocaleString } from '@utils/formatters'

export interface GetAnnouncementBarsItemVM {
  uuid: string
  text: string
  isActive: boolean
  startDate?: string
  startDatetime?: Date
  endDate?: string
  endDatetime?: Date
  isInProgress: boolean
  isFuture: boolean
}

export interface GetAnnouncementBarsGroupVM {
  items: Array<GetAnnouncementBarsItemVM>
}

export type GetAnnouncementBarsVM = HashTable<GetAnnouncementBarsGroupVM>

export const getAnnouncementBarsVM = (
  dateProvider: DateProvider
): GetAnnouncementBarsVM => {
  const announcementBarStore = useAnnouncementBarStore()
  const bars = announcementBarStore.items
  const sorted = bars.sort(sortByOrder)
  const now = dateProvider.now()

  const mapToVM = (b: AnnouncementBar) => getAnnouncementBarGroupItemVM(b, now)

  return {
    'En cours': {
      items: sorted.filter((b) => !isAnnouncementBarEnded(b, now)).map(mapToVM)
    },
    Terminées: {
      items: sorted.filter((b) => isAnnouncementBarEnded(b, now)).map(mapToVM)
    },
    Tous: {
      items: sorted.map(mapToVM)
    }
  }
}

const getAnnouncementBarGroupItemVM = (b: AnnouncementBar, date: Timestamp) => {
  return {
    uuid: b.uuid,
    text: b.text,
    isActive: b.isActive,
    startDate: b.startDate ? timestampToLocaleString(b.startDate, 'fr-FR') : '',
    startDatetime: new Date(b.startDate || ''),
    endDate: b.endDate ? timestampToLocaleString(b.endDate, 'fr-FR') : '',
    endDatetime: new Date(b.endDate || ''),
    isInProgress: isAnnouncementBarInProgress(b, date),
    isFuture: !isAnnouncementBarStarted(b, date)
  }
}
