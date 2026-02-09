import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const creditManualPoints = async (
  customerUuid: UUID,
  points: number,
  reason: string,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const transaction = await loyaltyGateway.creditManualPoints(
    customerUuid,
    points,
    reason
  )
  const store = useLoyaltyStore()
  store.addTransaction(transaction)
}
