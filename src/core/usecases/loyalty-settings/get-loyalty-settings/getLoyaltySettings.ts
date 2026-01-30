import type { LoyaltySettingsGateway } from '@core/gateways/loyaltySettingsGateway'
import { useLoyaltySettingsStore } from '@store/loyaltySettingsStore'

export const getLoyaltySettings = async (
  loyaltySettingsGateway: LoyaltySettingsGateway
): Promise<void> => {
  const loyaltySettingsStore = useLoyaltySettingsStore()
  try {
    loyaltySettingsStore.startLoading()
    const settings = await loyaltySettingsGateway.get()
    loyaltySettingsStore.setSettings(settings)
  } finally {
    loyaltySettingsStore.stopLoading()
  }
}
