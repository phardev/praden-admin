import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const creditLoyaltyPoints = async (
  customerUuid: UUID,
  points: number,
  reason: string,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  await loyaltyGateway.creditPoints(customerUuid, points, reason)
  const updatedPoints = await loyaltyGateway.getCustomerPoints(customerUuid)
  loyaltyStore.setCustomerPoints(customerUuid, updatedPoints)
}
