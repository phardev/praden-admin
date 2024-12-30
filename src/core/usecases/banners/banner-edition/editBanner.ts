import { BannerGateway } from '@core/gateways/bannerGateway'
import { UUID } from '@core/types/types'
import { useBannerStore } from '@store/bannerStore'
import { CreateBannerDTO } from '@core/usecases/banners/banner-creation/createBanner'

export type EditBannerDTO = Partial<CreateBannerDTO>

export const editBanner = async (
  uuid: UUID,
  dto: EditBannerDTO,
  bannerGateway: BannerGateway
) => {
  const edited = await bannerGateway.edit(uuid, dto)
  const bannerStore = useBannerStore()
  bannerStore.edit(edited)
}
