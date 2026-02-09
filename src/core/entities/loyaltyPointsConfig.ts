import type { UUID } from '@core/types/types'

export interface LoyaltyPointsConfig {
  uuid: UUID
  pointsPerEuro: number
  updatedAt: string
}
