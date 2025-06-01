import { UUID } from '@core/types/types'
import { BannerGateway } from '@core/gateways/bannerGateway'
import { useBannerStore } from '@store/bannerStore'

export const getBanner = async (
  uuid: UUID,
  bannerGateway: BannerGateway
): Promise<void> => {
  const banner = await bannerGateway.get(uuid)
  const bannerStore = useBannerStore()
  bannerStore.setCurrent(banner)
}
