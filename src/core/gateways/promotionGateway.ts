import {
  CreatePromotionDTO,
  EditPromotionDTO,
  Promotion
} from '@core/entities/promotion'
import { PromotionStats } from '@core/entities/promotionStats'
import { UUID } from '@core/types/types'
import { PromotionListItem } from '@core/usecases/promotions/promotions-listing/promotionListItem'

export interface PromotionGateway {
  list(): Promise<Array<PromotionListItem>>
  create(promotion: CreatePromotionDTO): Promise<Promotion>
  edit(uuid: UUID, promotion: EditPromotionDTO): Promise<Promotion>
  getByUuid(uuid: UUID): Promise<Promotion>
  getPromotionsForProduct(productUuid: UUID): Promise<Array<Promotion>>
  getStats(uuid: UUID): Promise<PromotionStats>
  exportStatsPDF(uuid: UUID): Promise<Blob>
}
