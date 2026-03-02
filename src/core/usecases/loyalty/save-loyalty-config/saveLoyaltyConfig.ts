import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'

export const saveLoyaltyConfig = async (
  earningRate: number,
  redemptionRate: number,
  loyaltyGateway: LoyaltyGateway
): Promise<void> => {
  const store = useLoyaltyStore()
  try {
    store.startLoading()
    const config = await loyaltyGateway.saveConfig(earningRate, redemptionRate)
    store.setConfig(config)
  } finally {
    store.stopLoading()
  }
}
