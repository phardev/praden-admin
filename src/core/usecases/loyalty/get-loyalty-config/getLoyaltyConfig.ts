import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getLoyaltyConfig = async (
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.startLoading()
  const config = await loyaltyGateway.getConfig()
  if (config) {
    loyaltyStore.setConfig(config)
  }
  loyaltyStore.stopLoading()
}
