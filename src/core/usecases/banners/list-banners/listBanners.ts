import { BannerGateway } from '@core/gateways/bannerGateway'
import { useBannerStore } from '@store/bannerStore'

export const listBanners = async (bannerGateway: BannerGateway) => {
  const banners = await bannerGateway.list()
  const bannerStore = useBannerStore()
  bannerStore.list(banners)
}
