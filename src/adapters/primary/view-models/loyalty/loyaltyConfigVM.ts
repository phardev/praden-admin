import type { LoyaltyConfig } from '@core/entities/loyalty'
import { useLoyaltyStore } from '@store/loyaltyStore'

export interface LoyaltyConfigVM {
  pointsRatio: number
}

export const getLoyaltyConfigVM = (): LoyaltyConfigVM | null => {
  const store = useLoyaltyStore()
  const config: LoyaltyConfig | null = store.config

  if (!config) {
    return null
  }

  return {
    pointsRatio: config.pointsRatio
  }
}
