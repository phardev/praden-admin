import type { Timestamp, UUID } from '@core/types/types'

export interface DeliveryPriceRule {
  uuid: UUID
  deliveryMethodUuid: UUID
  name: string
  price: number
  minOrderValue: number
  maxWeight: number
  priority: number
  startDate: Timestamp | null
  endDate: Timestamp | null
  isActive: boolean
  createdAt: Timestamp
  createdBy: string
  updatedAt: Timestamp
  updatedBy: string
}

export type CreateDeliveryPriceRuleDTO = Omit<
  DeliveryPriceRule,
  'uuid' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>

export type EditDeliveryPriceRuleDTO = Partial<CreateDeliveryPriceRuleDTO>

export type DeliveryPriceRuleStatus =
  | 'disabled'
  | 'upcoming'
  | 'active'
  | 'expired'

export const computeDeliveryPriceRuleStatus = (
  rule: DeliveryPriceRule,
  now: Timestamp
): DeliveryPriceRuleStatus => {
  if (!rule.isActive) return 'disabled'
  if (rule.startDate && now < rule.startDate) return 'upcoming'
  if (rule.endDate && now >= rule.endDate) return 'expired'
  return 'active'
}
