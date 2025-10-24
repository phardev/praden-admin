import {
  Banner,
  isBannerInProgress,
  isBannerStarted,
  sortByOrder
} from '@core/entities/banner'
import { DateProvider } from '@core/gateways/dateProvider'
import { HashTable, Timestamp } from '@core/types/types'
import { useBannerStore } from '@store/bannerStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface GetBannersItemVM {
  uuid: string
  img: string
  isActive: boolean
  startDate?: string
  startDatetime?: Date
  endDate?: string
  endDatetime?: Date
  isInProgress: boolean
  isFuture: boolean
}

export interface GetBannersGroupVM {
  items: Array<GetBannersItemVM>
}

export type GetBannersVM = HashTable<GetBannersGroupVM>

export const getBannersVM = (dateProvider: DateProvider): GetBannersVM => {
  const bannerStore = useBannerStore()
  const banners = bannerStore.items
  const sorted = banners.sort(sortByOrder)
  const now = dateProvider.now()
  return {
    'En cours': {
      items: sorted.map((b) => {
        return getBannerGroupItemVM(b, now)
      })
    },
    'A venir': {
      items: sorted.map((b) => {
        return getBannerGroupItemVM(b, now)
      })
    },
    Tous: {
      items: sorted.map((b) => {
        return getBannerGroupItemVM(b, now)
      })
    }
  }
}

const getBannerGroupItemVM = (b: Banner, date: Timestamp) => {
  return {
    uuid: b.uuid,
    img: b.img,
    isActive: b.isActive,
    startDate: b.startDate ? timestampToLocaleString(b.startDate, 'fr-FR') : '',
    startDatetime: new Date(b.startDate || ''),
    endDate: b.endDate ? timestampToLocaleString(b.endDate, 'fr-FR') : '',
    endDatetime: new Date(b.endDate || ''),
    isInProgress: isBannerInProgress(b, date),
    isFuture: !isBannerStarted(b, date)
  }
}
