import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getCustomerLoyalty = async (
  customerUuid: UUID,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyalty = await loyaltyGateway.getCustomerLoyalty(customerUuid)
  const store = useLoyaltyStore()
  store.setCustomerLoyalty(loyalty)
}
