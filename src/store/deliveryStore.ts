import { defineStore } from 'pinia'
import { Delivery } from '@core/entities/delivery'

export const useDeliveryStore = defineStore('DeliveryStore', {
  state: () => {
    return {
      items: [] as Array<Delivery>,
      isLoading: false
    }
  },
  actions: {
    list(deliveries: Array<Delivery>) {
      this.items = deliveries
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
