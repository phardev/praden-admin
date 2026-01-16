import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getCustomerLoyaltyPoints = async (
  customerUuid: UUID,
  loyaltyGateway: LoyaltyGateway
) => {
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.startLoading()
  const loyalty = await loyaltyGateway.getCustomerLoyaltyPoints(customerUuid)
  loyaltyStore.setCustomerLoyalty(loyalty)
  loyaltyStore.stopLoading()
}
