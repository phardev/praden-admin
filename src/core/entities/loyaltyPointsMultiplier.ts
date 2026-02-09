import type { UUID } from '@core/types/types'

export interface LoyaltyPointsMultiplier {
  uuid: UUID
  startDate: string
  endDate: string
  multiplier: number
  createdAt: string
}
