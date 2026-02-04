import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getCustomerLoyaltyPoints = async (
  customerUuid: UUID,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  const points = await loyaltyGateway.getCustomerPoints(customerUuid)
  loyaltyStore.setCustomerPoints(customerUuid, points)
}
