import {
  CreatePromotionCodeDTO,
  PromotionCode
} from '@core/entities/promotionCode'
import { PromotionCodeStats } from '@core/entities/promotionCodeStats'
import { EditPromotionCodeDTO } from '../usecases/promotion-codes/promotion-code-edition/editPromotionCode'

export interface PromotionCodeGateway {
  list(): Promise<Array<PromotionCode>>
  getByCode(code: string): Promise<PromotionCode>
  create(dto: CreatePromotionCodeDTO): Promise<PromotionCode>
  edit(code: string, dto: EditPromotionCodeDTO): Promise<PromotionCode>
  getStats(code: string): Promise<PromotionCodeStats>
}
