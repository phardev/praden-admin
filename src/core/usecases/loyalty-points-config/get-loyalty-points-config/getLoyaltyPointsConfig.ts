import type { LoyaltyPointsConfigGateway } from '@core/gateways/loyaltyPointsConfigGateway'
import { useLoyaltyPointsConfigStore } from '@store/loyaltyPointsConfigStore'

export const getLoyaltyPointsConfig = async (
  loyaltyPointsConfigGateway: LoyaltyPointsConfigGateway
) => {
  const config = await loyaltyPointsConfigGateway.get()
  const loyaltyPointsConfigStore = useLoyaltyPointsConfigStore()
  loyaltyPointsConfigStore.setConfig(config)
}
