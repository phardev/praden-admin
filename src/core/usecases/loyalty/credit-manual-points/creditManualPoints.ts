import type {
  CreditPointsDTO,
  LoyaltyGateway
} from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const creditManualPoints = async (
  customerUuid: UUID,
  dto: CreditPointsDTO,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.startLoading()
  const transaction = await loyaltyGateway.creditPoints(customerUuid, dto)
  const existing = loyaltyStore.customerLoyalty[customerUuid]
  const currentBalance = existing?.balance ?? 0
  const currentTransactions = existing?.transactions ?? []
  loyaltyStore.setCustomerLoyalty(customerUuid, {
    balance: currentBalance + transaction.points,
    transactions: [...currentTransactions, transaction]
  })
  loyaltyStore.stopLoading()
}
