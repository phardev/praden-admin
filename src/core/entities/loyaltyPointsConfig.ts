import { Timestamp } from '@core/types/types'

export interface LoyaltyPointsConfig {
  pointsPerEuro: number
  isActive: boolean
  updatedAt: Timestamp
  updatedBy: string
}
