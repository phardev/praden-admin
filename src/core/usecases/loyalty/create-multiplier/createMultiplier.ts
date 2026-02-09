import type {
  CreateMultiplierDTO,
  LoyaltyGateway
} from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const createMultiplier = async (
  dto: CreateMultiplierDTO,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const loyaltyStore = useLoyaltyStore()
  loyaltyStore.startLoading()
  const multiplier = await loyaltyGateway.createMultiplier(dto)
  loyaltyStore.addMultiplier(multiplier)
  loyaltyStore.stopLoading()
}
