import type { Timestamp, UUID } from '@core/types/types'

export interface MultiplierRule {
  multiplier: number
  startDate: Timestamp
  endDate: Timestamp
}

export interface LoyaltyConfig {
  uuid: UUID
  eurosPerPoint: number
  multiplierRules: Array<MultiplierRule>
  createdAt: Timestamp
  createdBy: string
  updatedAt: Timestamp
  updatedBy: string
}
