import { UUID } from '@core/types/types'
import { BannerGateway } from '@core/gateways/bannerGateway'
import { useBannerStore } from '@store/bannerStore'

export const deleteBanner = async (
  uuid: UUID,
  bannerGateway: BannerGateway
) => {
  const deleted = await bannerGateway.delete(uuid)
  const bannerStore = useBannerStore()
  bannerStore.delete(deleted)
}
