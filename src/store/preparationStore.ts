import { defineStore } from 'pinia'
import { Order } from '@core/entities/order'

export const usePreparationStore = defineStore('PreparationStore', {
  state: () => {
    return {
      items: [] as Array<Order>
    }
  },
  actions: {
    list(orders: Array<Order>) {
      this.items = orders
    }
  }
})
