import { BannerGateway } from '@core/gateways/bannerGateway'
import { useBannerStore } from '@store/bannerStore'

export const createBanner = async (
  file: File,
  bannerGateway: BannerGateway
) => {
  const added = await bannerGateway.create(file)
  const bannerStore = useBannerStore()
  bannerStore.add(added)
}
