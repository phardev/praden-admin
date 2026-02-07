import type { LoyaltyConfig } from '@core/entities/loyalty/loyaltyConfig'
import type { MultiplierRule } from '@core/entities/loyalty/multiplierRule'
import type { PointsTransaction } from '@core/entities/loyalty/pointsTransaction'
import type { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useLoyaltyStore = defineStore('LoyaltyStore', {
  state: () => {
    return {
      config: null as LoyaltyConfig | null,
      multiplierRules: [] as Array<MultiplierRule>,
      customerLoyalty: null as {
        pointsBalance: number
        transactions: Array<PointsTransaction>
      } | null,
      isLoading: false
    }
  },
  actions: {
    setConfig(config: LoyaltyConfig) {
      this.config = JSON.parse(JSON.stringify(config))
    },
    setMultiplierRules(rules: Array<MultiplierRule>) {
      this.multiplierRules = JSON.parse(JSON.stringify(rules))
    },
    setCustomerLoyalty(loyalty: {
      pointsBalance: number
      transactions: Array<PointsTransaction>
    }) {
      this.customerLoyalty = JSON.parse(JSON.stringify(loyalty))
    },
    addMultiplierRule(rule: MultiplierRule) {
      this.multiplierRules.push(JSON.parse(JSON.stringify(rule)))
    },
    updateMultiplierRule(rule: MultiplierRule) {
      const index = this.multiplierRules.findIndex((r) => r.uuid === rule.uuid)
      if (index >= 0) {
        this.multiplierRules[index] = JSON.parse(JSON.stringify(rule))
      }
    },
    removeMultiplierRule(uuid: UUID) {
      const index = this.multiplierRules.findIndex((r) => r.uuid === uuid)
      if (index >= 0) {
        this.multiplierRules.splice(index, 1)
      }
    },
    addTransaction(transaction: PointsTransaction) {
      if (!this.customerLoyalty) return
      this.customerLoyalty.transactions.push(
        JSON.parse(JSON.stringify(transaction))
      )
      this.customerLoyalty.pointsBalance += transaction.points
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
