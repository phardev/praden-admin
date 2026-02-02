import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const getLoyaltyTransactions = async (
  customerUuid: UUID,
  loyaltyGateway: LoyaltyGateway
) => {
  const loyaltyBalance = await loyaltyGateway.getCustomerLoyalty(customerUuid)
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.setTransactions(loyaltyBalance.transactions)
  loyaltyStore.setBalance(loyaltyBalance.totalPoints)
  loyaltyStore.setExpiringPoints(loyaltyBalance.expiringPoints)
  loyaltyStore.setExpiringDate(loyaltyBalance.expiringDate)
}
