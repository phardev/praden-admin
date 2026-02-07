import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const creditCustomerPoints = async (
  customerUuid: UUID,
  points: number,
  loyaltyGateway: LoyaltyGateway,
  description?: string
): Promise<void> => {
  await loyaltyGateway.creditPoints(customerUuid, points, description)
  const loyalty = await loyaltyGateway.getCustomerLoyalty(customerUuid)
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.setCustomerLoyalty(loyalty)
}
