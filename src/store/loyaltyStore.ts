import type {
  CustomerLoyaltyPoints,
  LoyaltyConfig,
  LoyaltyPointsMultiplier
} from '@core/entities/loyalty'
import type { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useLoyaltyStore = defineStore('LoyaltyStore', {
  state: () => {
    return {
      config: null as LoyaltyConfig | null,
      customerPoints: new Map<UUID, CustomerLoyaltyPoints>(),
      multipliers: [] as LoyaltyPointsMultiplier[],
      isLoading: false
    }
  },
  actions: {
    setConfig(config: LoyaltyConfig | null) {
      this.config = config
    },
    setCustomerPoints(customerUuid: UUID, points: CustomerLoyaltyPoints) {
      this.customerPoints.set(customerUuid, points)
    },
    setMultipliers(multipliers: LoyaltyPointsMultiplier[]) {
      this.multipliers = multipliers
    },
    addMultiplier(multiplier: LoyaltyPointsMultiplier) {
      this.multipliers.push(multiplier)
    },
    updateMultiplier(uuid: UUID, multiplier: LoyaltyPointsMultiplier) {
      this.multipliers = this.multipliers.map((m) =>
        m.uuid === uuid ? multiplier : m
      )
    },
    removeMultiplier(uuid: UUID) {
      this.multipliers = this.multipliers.filter((m) => m.uuid !== uuid)
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
