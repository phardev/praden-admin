import type { LoyaltyConfigGateway } from '@core/gateways/loyaltyConfigGateway'
import { useLoyaltyConfigStore } from '@store/loyaltyConfigStore'

export const getLoyaltyConfig = async (
  loyaltyConfigGateway: LoyaltyConfigGateway
): Promise<void> => {
  const config = await loyaltyConfigGateway.get()
  const loyaltyConfigStore = useLoyaltyConfigStore()
  loyaltyConfigStore.setConfig(config)
}
