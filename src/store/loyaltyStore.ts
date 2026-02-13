import type {
  LoyaltyConfig,
  MultiplierPeriod
} from '@core/entities/loyaltyConfig'
import type {
  CustomerLoyalty,
  LoyaltyPointsTransaction
} from '@core/entities/loyaltyPointsTransaction'
import type { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useLoyaltyStore = defineStore('LoyaltyStore', {
  state: () => {
    return {
      customerLoyalty: undefined as CustomerLoyalty | undefined,
      config: undefined as LoyaltyConfig | undefined,
      isLoading: false
    }
  },
  actions: {
    setCustomerLoyalty(loyalty: CustomerLoyalty) {
      this.customerLoyalty = loyalty
    },
    addTransaction(transaction: LoyaltyPointsTransaction) {
      if (!this.customerLoyalty) return
      this.customerLoyalty.transactions.push(transaction)
      this.customerLoyalty.balance += transaction.points
    },
    setConfig(config: LoyaltyConfig) {
      this.config = config
    },
    addMultiplier(multiplier: MultiplierPeriod) {
      if (!this.config) return
      this.config.multipliers.push(multiplier)
    },
    removeMultiplier(uuid: UUID) {
      if (!this.config) return
      this.config.multipliers = this.config.multipliers.filter(
        (m) => m.uuid !== uuid
      )
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
