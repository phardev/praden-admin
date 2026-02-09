import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const deleteMultiplier = async (
  uuid: UUID,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  await loyaltyGateway.deleteMultiplier(uuid)
  const store = useLoyaltyStore()
  store.removeMultiplier(uuid)
}
