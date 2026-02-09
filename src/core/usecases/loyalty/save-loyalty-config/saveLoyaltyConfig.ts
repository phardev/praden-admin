import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const saveLoyaltyConfig = async (
  earningRate: number,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const config = await loyaltyGateway.saveConfig(earningRate)
  const store = useLoyaltyStore()
  store.setConfig(config)
}
