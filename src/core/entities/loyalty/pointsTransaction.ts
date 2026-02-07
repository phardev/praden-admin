import type { UUID } from '@core/types/types'

export const PointsTransactionType = {
  Earned: 'EARNED',
  Expired: 'EXPIRED',
  ManualCredit: 'MANUAL_CREDIT'
} as const
export type PointsTransactionType =
  (typeof PointsTransactionType)[keyof typeof PointsTransactionType]

export interface PointsTransaction {
  uuid: UUID
  customerUuid: UUID
  type: PointsTransactionType
  points: number
  orderUuid?: UUID
  expiresAt?: string
  description?: string
  createdAt: string
}
