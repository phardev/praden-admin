import { sortByOrder } from '@core/usecases/banners/list-banners/banner'
import { useBannerStore } from '@store/bannerStore'

export interface GetBannersItemVM {
  uuid: string
  img: string
}

export interface GetBannersVM {
  items: Array<GetBannersItemVM>
}

export const getBannersVM = (): GetBannersVM => {
  const bannerStore = useBannerStore()
  const banners = bannerStore.items
  const sorted = banners.sort(sortByOrder)
  return {
    items: sorted.map((b) => {
      return {
        uuid: b.uuid,
        img: b.img
      }
    })
  }
}
