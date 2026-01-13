import { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'

export interface UpdateLoyaltyPointsConfigDTO {
  pointsPerEuro: number
  minimumOrderAmount: number
  isActive: boolean
}

export interface LoyaltyPointsConfigGateway {
  get(): Promise<LoyaltyPointsConfig | null>
  update(dto: UpdateLoyaltyPointsConfigDTO): Promise<LoyaltyPointsConfig>
}
