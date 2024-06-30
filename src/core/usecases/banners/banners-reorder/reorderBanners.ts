import { BannerGateway } from '@core/gateways/bannerGateway'
import { Banner } from '@core/usecases/banners/list-banners/banner'
import { useBannerStore } from '@store/bannerStore'

export const reorderBanners = async (
  banners: Array<Banner>,
  bannerGateway: BannerGateway
) => {
  const reordered = await bannerGateway.reorder(banners)
  const bannerStore = useBannerStore()
  bannerStore.list(reordered)
}
