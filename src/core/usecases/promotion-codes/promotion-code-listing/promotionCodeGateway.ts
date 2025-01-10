import {
  CreatePromotionCodeDTO,
  PromotionCode
} from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'

export interface PromotionCodeGateway {
  list(): Promise<Array<PromotionCode>>
  getByCode(code: string): Promise<PromotionCode>
  create(dto: CreatePromotionCodeDTO): Promise<PromotionCode>
}
