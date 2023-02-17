import { defineStore } from 'pinia'
import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'

export const usePreparationStore = defineStore('PreparationStore', {
  state: () => {
    return {
      items: [] as Array<Order>,
      selected: [] as Array<UUID>,
      current: undefined as Order | undefined
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
    remove(uuid: UUID) {
      const index = this.items.findIndex((o) => o.uuid === uuid)
      this.items.splice(index, 1)
      this.selected = []
    },
    removeCurrent() {
      this.current = undefined
    },
    toggleSelect(uuid: UUID) {
      const index = this.selected.findIndex((s) => s === uuid)
      if (index > -1) {
        this.selected.splice(index, 1)
      } else {
        this.selected.push(uuid)
      }
    },
    toggleSelectAll() {
      if (this.selected.length) this.selected = []
      else this.selected = this.items.map((i) => i.uuid)
    },
    setCurrent(order: Order) {
      this.current = order
    }
  }
})
