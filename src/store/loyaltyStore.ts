import type { CustomerLoyalty, LoyaltyConfig } from '@core/entities/loyalty'
import { defineStore } from 'pinia'

export const useLoyaltyStore = defineStore('LoyaltyStore', {
  state: () => {
    return {
      config: null as LoyaltyConfig | null,
      customerLoyalty: new Map<string, CustomerLoyalty>()
    }
  },
  actions: {
    setConfig(config: LoyaltyConfig) {
      this.config = config
    },
    setCustomerLoyalty(customerUuid: string, loyalty: CustomerLoyalty) {
      this.customerLoyalty.set(customerUuid, loyalty)
    }
  }
})
