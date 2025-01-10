import {
  CreatePromotionCodeDTO,
  PromotionCode
} from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import { EditPromotionCodeDTO } from '../promotion-code-edition/editPromotionCode'

export interface PromotionCodeGateway {
  list(): Promise<Array<PromotionCode>>
  getByCode(code: string): Promise<PromotionCode>
  create(dto: CreatePromotionCodeDTO): Promise<PromotionCode>
  edit(code: string, dto: EditPromotionCodeDTO): Promise<PromotionCode>
}
