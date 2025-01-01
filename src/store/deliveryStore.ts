import { Delivery } from '@core/entities/order'
import { defineStore } from 'pinia'

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
