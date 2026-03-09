import { ReductionType } from '@core/entities/promotion'
import { Timestamp, UUID } from '@core/types/types'
import { Product } from './product'

export type CreatePromotionCodeDTO = Omit<PromotionCode, 'uuid' | 'currentUses'>

export enum PromotionScope {
  Products = 'PRODUCTS',
  Delivery = 'DELIVERY'
}

export interface PromotionCode {
  uuid: UUID
  code: string
  reductionType: ReductionType
  scope: PromotionScope
  amount: number
  currentUses: number
  conditions: PromotionCodeConditions
  startDate?: Timestamp
  endDate?: Timestamp
}

export interface PromotionCodeConditions {
  minimumAmount?: number
  maximumUsage?: number
  deliveryMethodUuid?: UUID
  products?: Array<Product>
  maxWeight?: number
}

export const isPromotionCodeStarted = (
  p: PromotionCode,
  now: Timestamp
): boolean => {
  return !p.startDate ? true : p.startDate < now
}

export const isPromotionCodeEnded = (
  p: PromotionCode,
  now: Timestamp
): boolean => {
  return !p.endDate ? false : now > p.endDate
}

export const isPromotionCodeInProgress = (
  p: PromotionCode,
  now: Timestamp
): boolean => {
  return isPromotionCodeStarted(p, now) && !isPromotionCodeEnded(p, now)
}
