import { CreatePromotionDTO, Promotion } from '@core/entities/promotion'

export interface PromotionGateway {
  list(): Promise<Array<Promotion>>
  create(promotion: CreatePromotionDTO): Promise<Promotion>
}
