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
      isLoading: false
    }
  },
  actions: {
    list(tab: CartListTab, items: Array<CartListItem>) {
      this.items[tab] = items
    },
    append(tab: CartListTab, items: Array<CartListItem>) {
      this.items[tab] = [...this.items[tab], ...items]
    },
    setHasMore(tab: CartListTab, hasMore: boolean) {
      this.hasMore[tab] = hasMore
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
