import { ReductionType } from '@core/entities/promotion'
import { PromotionScope } from '@core/entities/promotionCode'
import { Timestamp, UUID } from '@core/types/types'

export const WelcomeCodeStatus = {
  Sent: 'SENT',
  Usable: 'USABLE',
  Scheduled: 'SCHEDULED',
  Ended: 'ENDED',
  Disabled: 'DISABLED'
} as const

export type WelcomeCodeStatus =
  (typeof WelcomeCodeStatus)[keyof typeof WelcomeCodeStatus]

export interface WelcomeCodeConditions {
  minimumAmount?: number
  deliveryMethodUuids?: Array<UUID>
  maxWeight?: number
}

export interface WelcomeCodeDTO {
  code: string
  reductionType: ReductionType
  scope: PromotionScope
  amount: number
  conditions: WelcomeCodeConditions
  startDate?: Timestamp
  endDate?: Timestamp
}

export interface WelcomeCode extends WelcomeCodeDTO {
  uuid: UUID
  isActive: boolean
  sentCount: number
  usedCount: number
  status: WelcomeCodeStatus
  conversionRate?: number
}
