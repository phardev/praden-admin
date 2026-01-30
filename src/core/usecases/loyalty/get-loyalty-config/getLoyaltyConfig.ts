import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getLoyaltyConfig = async (
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const config = await loyaltyGateway.getConfig()
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.setConfig(config)
}
