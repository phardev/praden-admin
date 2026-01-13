import { UUID } from '@core/types/types'

export interface LoyaltyPointsConfig {
  uuid: UUID
  pointsPerEuro: number
  minimumOrderAmount: number
  isActive: boolean
}
