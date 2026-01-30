import type { LoyaltySettingsGateway } from '@core/gateways/loyaltySettingsGateway'
import type { UUID } from '@core/types/types'
import { useLoyaltySettingsStore } from '@store/loyaltySettingsStore'

export const updateLoyaltySettings = async (
  uuid: UUID,
  pointsRatio: number,
  loyaltySettingsGateway: LoyaltySettingsGateway
): Promise<void> => {
  const loyaltySettingsStore = useLoyaltySettingsStore()
  try {
    loyaltySettingsStore.startLoading()
    const updatedSettings = await loyaltySettingsGateway.update(
      uuid,
      pointsRatio
    )
    loyaltySettingsStore.setSettings(updatedSettings)
  } finally {
    loyaltySettingsStore.stopLoading()
  }
}
