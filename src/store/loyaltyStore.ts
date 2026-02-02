import type { LoyaltyTransaction } from '@core/entities/loyaltyTransaction'
import type { Timestamp } from '@core/types/types'
import { defineStore } from 'pinia'

export const useLoyaltyStore = defineStore('LoyaltyStore', {
  state: () => {
    return {
      transactions: [] as Array<LoyaltyTransaction>,
      balance: 0,
      expiringPoints: 0,
      expiringDate: undefined as Timestamp | undefined,
      isLoading: false
    }
  },
  actions: {
    setTransactions(transactions: Array<LoyaltyTransaction>) {
      this.transactions = transactions
    },
    setBalance(balance: number) {
      this.balance = balance
    },
    setExpiringPoints(expiringPoints: number) {
      this.expiringPoints = expiringPoints
    },
    setExpiringDate(expiringDate: Timestamp | undefined) {
      this.expiringDate = expiringDate
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
