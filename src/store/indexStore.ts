import { defineStore } from 'pinia'

export const useIndexStore = defineStore('IndexStore', {
  state: () => {
    return {
      count: 0,
      indexedProducts: 0
    }
  },
  actions: {
    setCount(count: number) {
      this.count = count
    },
    addIndexedProducts(count: number) {
      this.indexedProducts += count
    }
  }
})
