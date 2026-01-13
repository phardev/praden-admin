import type {
  LoyaltyPointsConfigGateway,
  UpdateLoyaltyPointsConfigDTO
} from '@core/gateways/loyaltyPointsConfigGateway'
import { useLoyaltyPointsConfigStore } from '@store/loyaltyPointsConfigStore'

export type { UpdateLoyaltyPointsConfigDTO }

export const updateLoyaltyPointsConfig = async (
  dto: UpdateLoyaltyPointsConfigDTO,
  loyaltyPointsConfigGateway: LoyaltyPointsConfigGateway
) => {
  const updated = await loyaltyPointsConfigGateway.update(dto)
  const loyaltyPointsConfigStore = useLoyaltyPointsConfigStore()
  loyaltyPointsConfigStore.setConfig(updated)
}
