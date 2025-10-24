import { BannerGateway } from '@core/gateways/bannerGateway'
import { UUID } from '@core/types/types'
import { useBannerStore } from '@store/bannerStore'

export const reorderBanners = async (
  banners: Array<UUID>,
  bannerGateway: BannerGateway
) => {
  const reordered = await bannerGateway.reorder(banners)
  const bannerStore = useBannerStore()
  bannerStore.list(reordered)
}
