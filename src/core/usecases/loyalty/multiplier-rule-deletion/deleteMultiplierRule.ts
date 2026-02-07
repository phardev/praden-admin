import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const deleteMultiplierRule = async (
  uuid: UUID,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  await loyaltyGateway.deleteMultiplierRule(uuid)
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.removeMultiplierRule(uuid)
}
