import { InMemoryLoyaltySettingsGateway } from '@adapters/secondary/loyalty-settings-gateways/InMemoryLoyaltySettingsGateway'
import type { LoyaltySettings } from '@core/entities/loyaltySettings'
import { updateLoyaltySettings } from '@core/usecases/loyalty-settings/update-loyalty-settings/updateLoyaltySettings'
import { useLoyaltySettingsStore } from '@store/loyaltySettingsStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Update loyalty settings', () => {
  let loyaltySettingsStore: ReturnType<typeof useLoyaltySettingsStore>
  let loyaltySettingsGateway: InMemoryLoyaltySettingsGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltySettingsStore = useLoyaltySettingsStore()
    loyaltySettingsGateway = new InMemoryLoyaltySettingsGateway()
  })

  describe('Update existing settings', () => {
    const existingSettings: LoyaltySettings = {
      uuid: 'settings-uuid',
      pointsRatio: 0.1
    }
    const expectedSettings: LoyaltySettings = {
      uuid: 'settings-uuid',
      pointsRatio: 0.2
    }

    beforeEach(async () => {
      loyaltySettingsGateway.feedWith(existingSettings)
      await updateLoyaltySettings(
        existingSettings.uuid,
        0.2,
        loyaltySettingsGateway
      )
    })

    it('should update the settings in the store', () => {
      expect(loyaltySettingsStore.settings).toStrictEqual(expectedSettings)
    })

    it('should update the settings in the gateway', async () => {
      expect(await loyaltySettingsGateway.get()).toStrictEqual(expectedSettings)
    })
  })

  describe('Loading', () => {
    const existingSettings: LoyaltySettings = {
      uuid: 'settings-uuid',
      pointsRatio: 0.1
    }

    beforeEach(() => {
      loyaltySettingsGateway.feedWith(existingSettings)
    })

    it('should be aware during loading', async () => {
      const unsubscribe = loyaltySettingsStore.$subscribe(
        (_mutation: unknown, state: { isLoading: boolean }) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await updateLoyaltySettings(
        existingSettings.uuid,
        0.2,
        loyaltySettingsGateway
      )
    })

    it('should be aware that loading is over', async () => {
      await updateLoyaltySettings(
        existingSettings.uuid,
        0.2,
        loyaltySettingsGateway
      )
      expect(loyaltySettingsStore.isLoading).toBe(false)
    })
  })
})
