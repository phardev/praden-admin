import type { LoyaltyConfig } from '@core/entities/loyalty'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const updateLoyaltyConfig = async (
  config: LoyaltyConfig,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  await loyaltyGateway.updateConfig(config)
  loyaltyStore.setConfig(config)
}
