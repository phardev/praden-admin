import { DeliveryMethod } from '@core/entities/order'
import { defineStore } from 'pinia'

export const useDeliveryMethodStore = defineStore('DeliveryMethodStore', {
  state: () => {
    return {
      items: [] as Array<DeliveryMethod>,
      isLoading: false
    }
  },
  actions: {
    list(deliveryMethods: Array<DeliveryMethod>) {
      this.items = deliveryMethods
    },
    edit(deliveryMethod: DeliveryMethod) {
      this.items = this.items.map((d) => {
        return d.uuid === deliveryMethod.uuid ? deliveryMethod : d
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
