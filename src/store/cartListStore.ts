import { type CartListItem, CartListTab } from '@core/entities/cart'
import { defineStore } from 'pinia'

const byTab = <T>(value: () => T): Record<CartListTab, T> => ({
  [CartListTab.All]: value(),
  [CartListTab.Open]: value(),
  [CartListTab.Abandoned]: value(),
  [CartListTab.Closed]: value()
})

export const useCartListStore = defineStore('CartListStore', {
  state: () => {
    return {
      items: byTab<Array<CartListItem>>(() => []),
      hasMore: byTab<boolean>(() => false),
      isLoading: byTab<boolean>(() => false)
    }
  },
  actions: {
    list(tab: CartListTab, items: Array<CartListItem>) {
      this.items[tab] = items
    },
    append(tab: CartListTab, items: Array<CartListItem>) {
      const listedUuids = new Set(this.items[tab].map((item) => item.uuid))
      const unlisted = items.filter((item) => !listedUuids.has(item.uuid))
      this.items[tab] = [...this.items[tab], ...unlisted]
    },
    setHasMore(tab: CartListTab, hasMore: boolean) {
      this.hasMore[tab] = hasMore
    },
    startLoading(tab: CartListTab) {
      this.isLoading[tab] = true
    },
    stopLoading(tab: CartListTab) {
      this.isLoading[tab] = false
    }
  }
})
