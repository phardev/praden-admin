import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const deleteMultiplier = async (
  uuid: UUID,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  await loyaltyGateway.deleteMultiplier(uuid)
  loyaltyStore.removeMultiplier(uuid)
}
