import { useBannerStore } from '@store/bannerStore'
import { BannerGateway } from '@core/gateways/bannerGateway'

export const listBanners = async (bannerGateway: BannerGateway) => {
  const banners = await bannerGateway.list()
  const bannerStore = useBannerStore()
  bannerStore.list(banners)
}
