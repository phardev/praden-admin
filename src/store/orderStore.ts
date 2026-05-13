import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('OrderStore', {
  state: () => {
    return {
      items: [] as Array<Order>,
      current: undefined as Order | undefined,
      hasMore: false as boolean,
      isLoading: false
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: UUID): Order => {
        const order = state.items.find((p) => p.uuid === uuid)
        return order!
      }
    }
  },
  actions: {
    list(orders: Array<Order>) {
      orders.forEach((o) => {
        const existing = this.items.find((i) => i.uuid === o.uuid)
        if (existing) {
          this.items = this.items.map((i) => (i.uuid === o.uuid ? o : i))
        } else {
          this.items.push(o)
        }
      })
      this.hasMore = orders.length > 0
    },
    batch(orders: Array<Order>) {
      this.items.push(...orders)
    },
    setCurrent(order: Order) {
      this.current = order
    },
    update(order: Order) {
      this.items = this.items.map((i) => {
        return i.uuid === order.uuid ? order : i
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
