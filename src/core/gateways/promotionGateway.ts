import {
  CreatePromotionDTO,
  EditPromotionDTO,
  Promotion
} from '@core/entities/promotion'
import { UUID } from '@core/types/types'

export interface PromotionGateway {
  list(): Promise<Array<Promotion>>
  create(promotion: CreatePromotionDTO): Promise<Promotion>
  edit(uuid: UUID, promotion: EditPromotionDTO): Promise<Promotion>
}
