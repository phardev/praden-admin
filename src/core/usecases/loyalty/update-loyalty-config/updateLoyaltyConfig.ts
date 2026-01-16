import type {
  LoyaltyGateway,
  UpdateLoyaltyConfigDTO
} from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const updateLoyaltyConfig = async (
  dto: UpdateLoyaltyConfigDTO,
  loyaltyGateway: LoyaltyGateway
) => {
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.startLoading()
  const config = await loyaltyGateway.updateConfig(dto)
  loyaltyStore.setConfig(config)
  loyaltyStore.stopLoading()
}
