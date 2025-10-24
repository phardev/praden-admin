import { Banner } from '@core/entities/banner'
import { BannerGateway } from '@core/gateways/bannerGateway'
import { useBannerStore } from '@store/bannerStore'

export type CreateBannerDTO = Pick<Banner, 'href' | 'startDate' | 'endDate'> & {
  img: File
  order?: number
  isActive?: boolean
}

export const createBanner = async (
  dto: CreateBannerDTO,
  bannerGateway: BannerGateway
) => {
  const added = await bannerGateway.create(dto)
  const bannerStore = useBannerStore()
  bannerStore.list(added)
}
