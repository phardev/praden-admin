import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const updateLoyaltyConfig = async (
  pointsPerEuro: number,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const updated = await loyaltyGateway.updateConfig(pointsPerEuro)
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.setConfig(updated)
}
