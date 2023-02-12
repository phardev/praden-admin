import { defineStore } from 'pinia'
import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'

export const usePreparationStore = defineStore('PreparationStore', {
  state: () => {
    return {
      items: [] as Array<Order>,
      selected: [] as Array<UUID>
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
    },
    select(uuids: Array<UUID>) {
      this.selected.push(...uuids)
    }
  }
})
