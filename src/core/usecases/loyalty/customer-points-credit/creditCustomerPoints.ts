import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const creditCustomerPoints = async (
  customerUuid: UUID,
  points: number,
  loyaltyGateway: LoyaltyGateway,
  description?: string
): Promise<void> => {
  const transaction = await loyaltyGateway.creditPoints(
    customerUuid,
    points,
    description
  )
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.addTransaction(transaction)
}
