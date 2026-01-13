import { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import { defineStore } from 'pinia'

export const useLoyaltyPointsConfigStore = defineStore(
  'LoyaltyPointsConfigStore',
  {
    state: () => {
      return {
        config: null as LoyaltyPointsConfig | null,
        isLoading: false
      }
    },
    getters: {
      loyaltyPointsConfig: (state) => state.config
    },
    actions: {
      setConfig(config: LoyaltyPointsConfig | null) {
        this.config = config ? JSON.parse(JSON.stringify(config)) : null
      },
      startLoading() {
        this.isLoading = true
      },
      stopLoading() {
        this.isLoading = false
      }
    }
  }
)
