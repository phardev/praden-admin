import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const listMultipliers = async (
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  const multipliers = await loyaltyGateway.listMultipliers()
  loyaltyStore.setMultipliers(multipliers)
}
