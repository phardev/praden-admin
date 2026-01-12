import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'

export interface UpdateLoyaltyConfigDTO {
  pointsPerEuro: number
  isEnabled: boolean
}

export interface LoyaltyConfigGateway {
  get(): Promise<LoyaltyConfig>
  update(dto: UpdateLoyaltyConfigDTO): Promise<LoyaltyConfig>
}
