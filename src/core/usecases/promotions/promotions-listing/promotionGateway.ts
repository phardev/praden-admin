import {
  CreatePromotionDTO,
  Promotion
} from '@core/usecases/promotions/promotions-listing/promotion'

export interface PromotionGateway {
  list(): Promise<Array<Promotion>>
  create(promotion: CreatePromotionDTO): Promise<Promotion>
}
