import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getCustomerLoyalty = async (
  customerUuid: UUID,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  try {
    loyaltyStore.startLoading()
    const loyalty = await loyaltyGateway.getCustomerLoyalty(customerUuid)
    loyaltyStore.setCustomerLoyalty(loyalty)
  } finally {
    loyaltyStore.stopLoading()
  }
}
