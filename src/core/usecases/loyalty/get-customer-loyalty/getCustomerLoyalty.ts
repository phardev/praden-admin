import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getCustomerLoyalty = async (
  customerUuid: string,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyalty = await loyaltyGateway.getCustomerLoyalty(customerUuid)
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.setCustomerLoyalty(customerUuid, loyalty)
}
