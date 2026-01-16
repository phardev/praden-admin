import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getLoyaltyConfig = async (loyaltyGateway: LoyaltyGateway) => {
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.startLoading()
  const config = await loyaltyGateway.getConfig()
  loyaltyStore.setConfig(config)
  loyaltyStore.stopLoading()
}
