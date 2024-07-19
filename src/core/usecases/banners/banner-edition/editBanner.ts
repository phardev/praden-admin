import { BannerGateway } from '@core/gateways/bannerGateway'
import { UUID } from '@core/types/types'
import { Banner } from '@core/entities/banner'
import { useBannerStore } from '@store/bannerStore'

export type EditBannerDTO = Partial<Omit<Banner, 'uuid'>>

export const editBanner = async (
  uuid: UUID,
  dto: EditBannerDTO,
  bannerGateway: BannerGateway
) => {
  const edited = await bannerGateway.edit(uuid, dto)
  const bannerStore = useBannerStore()
  bannerStore.edit(edited)
}
