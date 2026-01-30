import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const updateLoyaltyConfig = async (
  eurosPerPoint: number,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const config = await loyaltyGateway.updateConfig(eurosPerPoint)
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.setConfig(config)
}
