import { Banner } from '@core/entities/banner'
import { UUID } from '@core/types/types'
import { EditBannerDTO } from '@core/usecases/banners/banner-edition/editBanner'
import { CreateBannerDTO } from '@core/usecases/banners/banner-creation/createBanner'

export interface BannerGateway {
  list(): Promise<Array<Banner>>
  reorder(bannerUuids: Array<UUID>): Promise<Array<Banner>>
  delete(uuid: UUID): Promise<Banner>
  create(dto: CreateBannerDTO): Promise<Array<Banner>>
  edit(uuid: UUID, dto: EditBannerDTO): Promise<Banner>
}
