import { defineStore } from 'pinia'
import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'

export const useOrderStore = defineStore('OrderStore', {
  state: () => {
    return {
      items: [] as Array<Order>,
      current: undefined as Order | undefined,
      isLoading: false
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: UUID): Order => {
        const order = state.items.find((p) => p.uuid === uuid)
        return order
      }
    }
  },
  actions: {
    list(orders: Array<Order>) {
      this.items = orders
    },
    setCurrent(order: Order) {
      this.current = order
    },
    update(order: Order) {
      this.items = this.items.map((i) => {
        return i.uuid === order.uuid ? order : i
      })
    },
    clearSelection() {
      this.selected = []
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
