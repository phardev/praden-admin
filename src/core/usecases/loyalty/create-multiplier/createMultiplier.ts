import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const createMultiplier = async (
  startDate: number,
  endDate: number,
  multiplier: number,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const created = await loyaltyGateway.createMultiplier(
    startDate,
    endDate,
    multiplier
  )
  const store = useLoyaltyStore()
  store.addMultiplier(created)
}
