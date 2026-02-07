import type {
  EditMultiplierRuleDTO,
  LoyaltyGateway
} from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const editMultiplierRule = async (
  uuid: UUID,
  dto: EditMultiplierRuleDTO,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const updated = await loyaltyGateway.editMultiplierRule(uuid, dto)
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.updateMultiplierRule(updated)
}
