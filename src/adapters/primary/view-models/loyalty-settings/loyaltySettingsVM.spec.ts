import type { LoyaltySettings } from '@core/entities/loyaltySettings'
import { useLoyaltySettingsStore } from '@store/loyaltySettingsStore'
import { createPinia, setActivePinia } from 'pinia'
import { loyaltySettingsVM } from './loyaltySettingsVM'

describe('Loyalty Settings View Model', () => {
  let loyaltySettingsStore: ReturnType<typeof useLoyaltySettingsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltySettingsStore = useLoyaltySettingsStore()
  })

  describe('pointsRatio', () => {
    it('should return 0 when no settings are configured', () => {
      const vm = loyaltySettingsVM()

      expect(vm.pointsRatio).toBe(0)
    })

    it('should return the points ratio from settings', () => {
      const settings: LoyaltySettings = {
        uuid: 'settings-1',
        pointsRatio: 0.1
      }
      loyaltySettingsStore.setSettings(settings)

      const vm = loyaltySettingsVM()

      expect(vm.pointsRatio).toBe(0.1)
    })
  })

  describe('formattedRatio', () => {
    it('should format ratio as 1 point per X euros when ratio is 0.1', () => {
      const settings: LoyaltySettings = {
        uuid: 'settings-1',
        pointsRatio: 0.1
      }
      loyaltySettingsStore.setSettings(settings)

      const vm = loyaltySettingsVM()

      expect(vm.formattedRatio).toBe('1 point pour 10€')
    })

    it('should format ratio as 1 point per X euros when ratio is 0.05', () => {
      const settings: LoyaltySettings = {
        uuid: 'settings-1',
        pointsRatio: 0.05
      }
      loyaltySettingsStore.setSettings(settings)

      const vm = loyaltySettingsVM()

      expect(vm.formattedRatio).toBe('1 point pour 20€')
    })

    it('should format ratio as 1 point per X euros when ratio is 0.2', () => {
      const settings: LoyaltySettings = {
        uuid: 'settings-1',
        pointsRatio: 0.2
      }
      loyaltySettingsStore.setSettings(settings)

      const vm = loyaltySettingsVM()

      expect(vm.formattedRatio).toBe('1 point pour 5€')
    })

    it('should return empty string when no settings are configured', () => {
      const vm = loyaltySettingsVM()

      expect(vm.formattedRatio).toBe('')
    })
  })

  describe('isLoading', () => {
    it('should return false when store is not loading', () => {
      const vm = loyaltySettingsVM()

      expect(vm.isLoading).toBe(false)
    })

    it('should return true when store is loading', () => {
      loyaltySettingsStore.startLoading()

      const vm = loyaltySettingsVM()

      expect(vm.isLoading).toBe(true)
    })
  })

  describe('hasSettings', () => {
    it('should return false when no settings are configured', () => {
      const vm = loyaltySettingsVM()

      expect(vm.hasSettings).toBe(false)
    })

    it('should return true when settings are configured', () => {
      const settings: LoyaltySettings = {
        uuid: 'settings-1',
        pointsRatio: 0.1
      }
      loyaltySettingsStore.setSettings(settings)

      const vm = loyaltySettingsVM()

      expect(vm.hasSettings).toBe(true)
    })
  })

  describe('settingsUuid', () => {
    it('should return undefined when no settings are configured', () => {
      const vm = loyaltySettingsVM()

      expect(vm.settingsUuid).toBeUndefined()
    })

    it('should return the uuid from settings', () => {
      const settings: LoyaltySettings = {
        uuid: 'settings-uuid-123',
        pointsRatio: 0.1
      }
      loyaltySettingsStore.setSettings(settings)

      const vm = loyaltySettingsVM()

      expect(vm.settingsUuid).toBe('settings-uuid-123')
    })
  })
})
