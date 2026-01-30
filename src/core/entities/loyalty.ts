export interface LoyaltyConfig {
  eurosPerPoint: number
  createdAt: string
  updatedAt: string
}

export interface LoyaltyTransaction {
  uuid: string
  orderUuid: string
  points: number
  earnedAt: string
  expiresAt: string
  isExpired: boolean
}

export interface CustomerLoyalty {
  balance: number
  totalEarned: number
  transactions: Array<LoyaltyTransaction>
}
