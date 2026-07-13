import { RelayPoint } from '@core/entities/relayPoint'
import { defineStore } from 'pinia'

export const useDpdRelayPointStore = defineStore('DpdRelayPointStore', {
  state: () => {
    return {
      items: [] as Array<RelayPoint>,
      isLoading: false
    }
  },
  actions: {
    list(points: Array<RelayPoint>) {
      this.items = points
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
