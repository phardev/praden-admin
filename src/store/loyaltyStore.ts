import type { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyaltyPointsMultiplier'
import type { LoyaltyPointsTransaction } from '@core/entities/loyaltyPointsTransaction'
import type { HashTable, UUID } from '@core/types/types'
import { defineStore } from 'pinia'

interface CustomerLoyalty {
  balance: number
  transactions: Array<LoyaltyPointsTransaction>
}

export const useLoyaltyStore = defineStore('LoyaltyStore', {
  state: () => {
    return {
      config: null as LoyaltyPointsConfig | null,
      multipliers: [] as Array<LoyaltyPointsMultiplier>,
      customerLoyalty: {} as HashTable<CustomerLoyalty>,
      isLoading: false
    }
  },
  actions: {
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    setConfig(config: LoyaltyPointsConfig) {
      this.config = JSON.parse(JSON.stringify(config))
    },
    setMultipliers(multipliers: Array<LoyaltyPointsMultiplier>) {
      this.multipliers = multipliers
    },
    addMultiplier(multiplier: LoyaltyPointsMultiplier) {
      this.multipliers.push(multiplier)
    },
    removeMultiplier(uuid: UUID) {
      this.multipliers = this.multipliers.filter((m) => m.uuid !== uuid)
    },
    setCustomerLoyalty(customerUuid: UUID, data: CustomerLoyalty) {
      this.customerLoyalty[customerUuid] = JSON.parse(JSON.stringify(data))
    }
  }
})
