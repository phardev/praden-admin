import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'

export const defaultLoyaltyConfig: LoyaltyConfig = {
  pointsPerEuro: 1,
  isEnabled: false
}

export const enabledLoyaltyConfig: LoyaltyConfig = {
  pointsPerEuro: 2,
  isEnabled: true
}
