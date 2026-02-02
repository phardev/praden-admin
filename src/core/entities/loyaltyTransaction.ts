import type { Timestamp, UUID } from '@core/types/types'

export const LoyaltyTransactionType = {
  Earning: 'EARNING',
  ManualCredit: 'MANUAL_CREDIT',
  Expiration: 'EXPIRATION',
  Redemption: 'REDEMPTION'
} as const

export type LoyaltyTransactionType =
  (typeof LoyaltyTransactionType)[keyof typeof LoyaltyTransactionType]

export interface LoyaltyTransaction {
  uuid: UUID
  customerUuid: UUID
  points: number
  type: LoyaltyTransactionType
  orderUuid?: UUID
  reason?: string
  expiresAt?: Timestamp
  createdAt: Timestamp
  createdBy: string
}

export interface CustomerLoyaltyBalance {
  customerUuid: UUID
  totalPoints: number
  expiringPoints: number
  expiringDate?: Timestamp
  transactions: Array<LoyaltyTransaction>
}
