import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getLoyaltyConfig = async (
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  const config = await loyaltyGateway.getConfig()
  loyaltyStore.setConfig(config)
}
