import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getLoyaltyConfig = async (
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  try {
    loyaltyStore.startLoading()
    const { config, rules } = await loyaltyGateway.getConfig()
    loyaltyStore.setConfig(config)
    loyaltyStore.setMultiplierRules(rules)
  } finally {
    loyaltyStore.stopLoading()
  }
}
