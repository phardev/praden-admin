import type { Timestamp, UUID } from '@core/types/types'

export interface MultiplierPeriod {
  uuid: UUID
  startDate: Timestamp
  endDate: Timestamp
  multiplier: number
  createdAt: Timestamp
  createdBy: string
  updatedAt: Timestamp
  updatedBy: string
}

export interface LoyaltyConfig {
  earningRate: number
  multipliers: Array<MultiplierPeriod>
}
