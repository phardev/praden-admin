import type { CreateMultiplierDTO } from '@core/entities/loyalty'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const createMultiplier = async (
  multiplier: CreateMultiplierDTO,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  await loyaltyGateway.createMultiplier(multiplier)
  const multipliers = await loyaltyGateway.listMultipliers()
  loyaltyStore.setMultipliers(multipliers)
}
