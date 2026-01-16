import { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import { CustomerLoyaltyPoints } from '@core/entities/loyaltyTransaction'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useLoyaltyStore = defineStore('LoyaltyStore', {
  state: () => {
    return {
      config: null as LoyaltyPointsConfig | null,
      customerLoyalty: null as CustomerLoyaltyPoints | null,
      isLoading: false
    }
  },
  getters: {
    loyaltyConfig: (state) => state.config,
    customerPoints: (state) => state.customerLoyalty
  },
  actions: {
    setConfig(config: LoyaltyPointsConfig | null) {
      this.config = config
    },
    setCustomerLoyalty(loyalty: CustomerLoyaltyPoints) {
      this.customerLoyalty = loyalty
    },
    clearCustomerLoyalty() {
      this.customerLoyalty = null
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
