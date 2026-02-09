import type { Timestamp, UUID } from '@core/types/types'

export const LoyaltyTransactionType = {
  Earned: 'EARNED',
  ManualCredit: 'MANUAL_CREDIT'
} as const
export type LoyaltyTransactionType =
  (typeof LoyaltyTransactionType)[keyof typeof LoyaltyTransactionType]

export interface LoyaltyPointsTransaction {
  uuid: UUID
  customerUuid: UUID
  type: LoyaltyTransactionType
  points: number
  orderUuid?: UUID
  reason?: string
  earnedAt: Timestamp
  expiresAt: Timestamp
  createdAt: Timestamp
  createdBy: string
}

export interface CustomerLoyalty {
  balance: number
  transactions: Array<LoyaltyPointsTransaction>
}
