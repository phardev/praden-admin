import type { LoyaltySettings } from '@core/entities/loyaltySettings'
import { defineStore } from 'pinia'

export const useLoyaltySettingsStore = defineStore('LoyaltySettingsStore', {
  state: () => {
    return {
      settings: null as LoyaltySettings | null,
      isLoading: false
    }
  },
  actions: {
    setSettings(settings: LoyaltySettings | null) {
      this.settings = settings
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
