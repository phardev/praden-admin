import type { UUID } from '@core/types/types'

export const TransactionType = {
  Earned: 'EARNED',
  ManualCredit: 'MANUAL_CREDIT',
  Expired: 'EXPIRED'
} as const
export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType]

export interface LoyaltyPointsTransaction {
  uuid: UUID
  type: TransactionType
  points: number
  orderUuid?: string
  reason?: string
  purchaseDate?: string
  expiresAt?: string
  createdAt: string
}
