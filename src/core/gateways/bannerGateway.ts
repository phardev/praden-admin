import { Banner } from '@core/usecases/banners/list-banners/banner'
import { UUID } from '@core/types/types'

export interface BannerGateway {
  list(): Promise<Array<Banner>>
  reorder(banners: Array<Banner>): Promise<Array<Banner>>
  delete(uuid: UUID): Promise<Banner>
  create(file: File): Promise<Banner>
}
