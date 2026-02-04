import type { EditMultiplierDTO } from '@core/entities/loyalty'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const editMultiplier = async (
  uuid: UUID,
  multiplier: EditMultiplierDTO,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  await loyaltyGateway.editMultiplier(uuid, multiplier)
  const multipliers = await loyaltyGateway.listMultipliers()
  loyaltyStore.setMultipliers(multipliers)
}
