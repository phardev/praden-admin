import type { UUID } from '@core/types/types'

export const LoyaltyTransactionType = {
  Earned: 'EARNED',
  Redeemed: 'REDEEMED',
  Expired: 'EXPIRED',
  Adjusted: 'ADJUSTED'
} as const
export type LoyaltyTransactionType =
  (typeof LoyaltyTransactionType)[keyof typeof LoyaltyTransactionType]

export interface LoyaltyTransaction {
  uuid: UUID
  points: number
  type: LoyaltyTransactionType
  orderUuid?: UUID
  expiresAt?: string
  createdAt: string
}
