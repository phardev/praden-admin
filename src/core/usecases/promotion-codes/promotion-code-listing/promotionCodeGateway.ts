import { PromotionCode } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'

export interface PromotionCodeGateway {
  list(): Promise<Array<PromotionCode>>
}
