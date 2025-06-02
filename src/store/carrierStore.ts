import { defineStore } from 'pinia'
import { Carrier } from '@core/entities/carrier'

export const useCarrierStore = defineStore('CarrierStore', {
  state: () => {
    return {
      items: [] as Array<Carrier>,
      isLoading: false
    }
  },
  actions: {
    list(carriers: Array<Carrier>) {
      this.items = carriers
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
