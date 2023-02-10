import { defineStore } from 'pinia'
import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'

export const usePreparationStore = defineStore('PreparationStore', {
  state: () => {
    return {
      items: [] as Array<Order>
    }
  },
  actions: {
    list(orders: Array<Order>) {
      this.items = orders
    },
    remove(uuid: UUID) {
      const index = this.items.findIndex((o) => o.uuid === uuid)
      this.items.splice(index, 1)
    }
  }
})
