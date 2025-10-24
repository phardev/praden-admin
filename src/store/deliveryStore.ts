import { Delivery } from '@core/entities/delivery'
import { defineStore } from 'pinia'

export const useDeliveryStore = defineStore('DeliveryStore', {
  state: () => {
    return {
      items: [] as Array<Delivery>,
      isLoading: false,
      labelBlob: null as Blob | null
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
    },
    setLabelBlob(blob: Blob | null) {
      this.labelBlob = blob
    }
  }
})
