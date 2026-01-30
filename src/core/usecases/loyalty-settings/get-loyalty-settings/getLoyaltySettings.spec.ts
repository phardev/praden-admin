import { InMemoryLoyaltySettingsGateway } from '@adapters/secondary/loyalty-settings-gateways/InMemoryLoyaltySettingsGateway'
import type { LoyaltySettings } from '@core/entities/loyaltySettings'
import { getLoyaltySettings } from '@core/usecases/loyalty-settings/get-loyalty-settings/getLoyaltySettings'
import { useLoyaltySettingsStore } from '@store/loyaltySettingsStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Get loyalty settings', () => {
  let loyaltySettingsStore: ReturnType<typeof useLoyaltySettingsStore>
  let loyaltySettingsGateway: InMemoryLoyaltySettingsGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltySettingsStore = useLoyaltySettingsStore()
    loyaltySettingsGateway = new InMemoryLoyaltySettingsGateway()
  })

  describe('Settings exist', () => {
    const existingSettings: LoyaltySettings = {
      uuid: 'settings-uuid',
      pointsRatio: 0.1
    }

    beforeEach(async () => {
      loyaltySettingsGateway.feedWith(existingSettings)
      await getLoyaltySettings(loyaltySettingsGateway)
    })

    it('should save the settings in the store', () => {
      expect(loyaltySettingsStore.settings).toStrictEqual(existingSettings)
    })
  })

  describe('Settings do not exist', () => {
    beforeEach(async () => {
      await getLoyaltySettings(loyaltySettingsGateway)
    })

    it('should set store settings to null', () => {
      expect(loyaltySettingsStore.settings).toBeNull()
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
      await getLoyaltySettings(loyaltySettingsGateway)
    })

    it('should be aware that loading is over', async () => {
      await getLoyaltySettings(loyaltySettingsGateway)
      expect(loyaltySettingsStore.isLoading).toBe(false)
    })
  })
})
