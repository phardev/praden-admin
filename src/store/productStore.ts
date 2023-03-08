import { defineStore } from 'pinia'
import { Product, Stock } from '../core/entities/product'

export const useProductStore = defineStore('ProductStore', {
  state: () => {
    return {
      items: [] as Array<Product>,
      stock: {} as Stock
    }
  },
  actions: {
    list(products: Array<Product>) {
      this.items = products
      this.items.forEach((i) => {
        this.stock[i.cip13] = i.availableStock
      })
    }
  }
})
