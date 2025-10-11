import { useAnnouncementBarStore } from '@store/announcementBarStore'
import { DateProvider } from '@core/gateways/dateProvider'
import { isAnnouncementBarInProgress } from '@core/entities/announcementBar'
import { Timestamp } from '@core/types/types'

export interface GetAnnouncementBarVM {
  uuid: string
  text: string
  isActive: boolean
  startDate?: Timestamp
  endDate?: Timestamp
  isInProgress: boolean
  isLoading: boolean
}

export const getAnnouncementBarVM = (
  dateProvider: DateProvider
): GetAnnouncementBarVM | null => {
  const announcementBarStore = useAnnouncementBarStore()
  const announcementBar = announcementBarStore.announcementBar

  if (!announcementBar) {
    return null
  }

  const now = dateProvider.now()

  return {
    uuid: announcementBar.uuid,
    text: announcementBar.text,
    isActive: announcementBar.isActive,
    startDate: announcementBar.startDate,
    endDate: announcementBar.endDate,
    isInProgress: isAnnouncementBarInProgress(announcementBar, now),
    isLoading: announcementBarStore.isLoading
  }
}
