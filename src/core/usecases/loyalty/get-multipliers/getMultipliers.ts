import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getMultipliers = async (
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.startLoading()
  const multipliers = await loyaltyGateway.getMultipliers()
  loyaltyStore.setMultipliers(multipliers)
  loyaltyStore.stopLoading()
}
