import { Timestamp, UUID } from '@core/types/types'

export interface LoyaltyTransaction {
  uuid: UUID
  orderUuid: UUID
  points: number
  eligibleAmount: number
  earnedAt: Timestamp
  expiresAt: Timestamp
  isExpired: boolean
}

export interface CustomerLoyaltyPoints {
  totalPoints: number
  activePoints: number
  transactions: LoyaltyTransaction[]
}
