import type {
  CreateMultiplierRuleDTO,
  LoyaltyGateway
} from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const createMultiplierRule = async (
  dto: CreateMultiplierRuleDTO,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const created = await loyaltyGateway.createMultiplierRule(dto)
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.addMultiplierRule(created)
}
