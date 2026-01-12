import type {
  LoyaltyConfigGateway,
  UpdateLoyaltyConfigDTO
} from '@core/gateways/loyaltyConfigGateway'
import { useLoyaltyConfigStore } from '@store/loyaltyConfigStore'

export type { UpdateLoyaltyConfigDTO }

export const updateLoyaltyConfig = async (
  dto: UpdateLoyaltyConfigDTO,
  loyaltyConfigGateway: LoyaltyConfigGateway
): Promise<void> => {
  const updated = await loyaltyConfigGateway.update(dto)
  const loyaltyConfigStore = useLoyaltyConfigStore()
  loyaltyConfigStore.setConfig(updated)
}
