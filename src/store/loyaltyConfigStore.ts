import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import { defineStore } from 'pinia'

export const useLoyaltyConfigStore = defineStore('LoyaltyConfigStore', {
  state: () => {
    return {
      config: undefined as LoyaltyConfig | undefined,
      isLoading: false
    }
  },
  getters: {
    loyaltyConfig: (state) => state.config
  },
  actions: {
    setConfig(config: LoyaltyConfig) {
      this.config = config
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
