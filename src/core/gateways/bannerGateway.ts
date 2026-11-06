import { Banner, BannerListItem } from '@core/entities/banner'
import { UUID } from '@core/types/types'
import { CreateBannerDTO } from '@core/usecases/banners/banner-creation/createBanner'
import { EditBannerDTO } from '@core/usecases/banners/banner-edition/editBanner'

export interface BannerGateway {
  list(): Promise<Array<BannerListItem>>
  reorder(bannerUuids: Array<UUID>): Promise<Array<BannerListItem>>
  delete(uuid: UUID): Promise<Banner>
  create(dto: CreateBannerDTO): Promise<Array<BannerListItem>>
  edit(uuid: UUID, dto: EditBannerDTO): Promise<Banner>
  get(uuid: UUID): Promise<Banner>
}
