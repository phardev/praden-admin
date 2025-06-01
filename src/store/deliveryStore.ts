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
    edit(delivery: Delivery) {
      this.items = this.items.map((d) => {
        return d.uuid === delivery.uuid ? delivery : d
      })
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
