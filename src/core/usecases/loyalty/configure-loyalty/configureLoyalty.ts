import type {
  LoyaltyGateway,
  SaveConfigDTO
} from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const configureLoyalty = async (
  dto: SaveConfigDTO,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.startLoading()
  const config = await loyaltyGateway.saveConfig(dto)
  loyaltyStore.setConfig(config)
  loyaltyStore.stopLoading()
}
