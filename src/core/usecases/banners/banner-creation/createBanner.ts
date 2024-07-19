import { BannerGateway } from '@core/gateways/bannerGateway'
import { useBannerStore } from '@store/bannerStore'
import { Banner } from '@core/entities/banner'

export type CreateBannerDTO = Pick<
  Banner,
  'img' | 'href' | 'startDate' | 'endDate'
> & {
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
