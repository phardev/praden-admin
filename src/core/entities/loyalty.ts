import type { Timestamp, UUID } from '@core/types/types'

export const LoyaltyTransactionType = {
  Earned: 'EARNED',
  ManualCredit: 'MANUAL_CREDIT',
  Expired: 'EXPIRED'
} as const
export type LoyaltyTransactionType =
  (typeof LoyaltyTransactionType)[keyof typeof LoyaltyTransactionType]

export interface LoyaltyConfig {
  pointsRatio: number
}

export interface LoyaltyPointsTransaction {
  uuid: UUID
  customerUuid: UUID
  type: LoyaltyTransactionType
  points: number
  orderUuid?: UUID
  reason?: string
  creditedBy?: string
  expiresAt?: Timestamp
  createdAt: Timestamp
}

export interface CustomerLoyaltyPoints {
  balance: number
  transactions: LoyaltyPointsTransaction[]
}

export interface LoyaltyPointsMultiplier {
  uuid: UUID
  name: string
  multiplierValue: number
  startDate: Timestamp
  endDate: Timestamp
  isActive: boolean
  createdAt: Timestamp
}

export type CreateMultiplierDTO = Omit<
  LoyaltyPointsMultiplier,
  'uuid' | 'isActive' | 'createdAt'
>

export type EditMultiplierDTO = Omit<
  LoyaltyPointsMultiplier,
  'uuid' | 'isActive' | 'createdAt'
>
