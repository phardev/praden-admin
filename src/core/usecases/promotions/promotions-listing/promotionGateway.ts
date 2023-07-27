import { Promotion } from '@core/usecases/promotions/promotions-listing/promotion'

export interface PromotionGateway {
  list(): Promise<Array<Promotion>>
}
