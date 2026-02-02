import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const creditLoyaltyPoints = async (
  customerUuid: UUID,
  points: number,
  reason: string,
  loyaltyGateway: LoyaltyGateway
) => {
  await loyaltyGateway.creditPoints(customerUuid, points, reason)
  const loyaltyBalance = await loyaltyGateway.getCustomerLoyalty(customerUuid)
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.setTransactions(loyaltyBalance.transactions)
  loyaltyStore.setBalance(loyaltyBalance.totalPoints)
  loyaltyStore.setExpiringPoints(loyaltyBalance.expiringPoints)
  loyaltyStore.setExpiringDate(loyaltyBalance.expiringDate)
}
