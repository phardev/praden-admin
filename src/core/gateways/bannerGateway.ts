import { Banner } from '@core/usecases/banners/list-banners/banner'
import { UUID } from '@core/types/types'
import { EditBannerDTO } from '@core/usecases/banners/banner-edition/editBanner'

export interface BannerGateway {
  list(): Promise<Array<Banner>>
  reorder(banners: Array<Banner>): Promise<Array<Banner>>
  delete(uuid: UUID): Promise<Banner>
  create(file: File): Promise<Banner>
  edit(uuid: UUID, dto: EditBannerDTO): Promise<Banner>
}
