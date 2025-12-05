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
