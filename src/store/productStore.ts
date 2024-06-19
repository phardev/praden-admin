import { defineStore } from 'pinia'
import { Product, ProductWithPromotion, Stock } from '@core/entities/product'

export const useProductStore = defineStore('ProductStore', {
  state: () => {
    return {
      items: [] as Array<Product>,
      stock: {} as Stock,
      current: undefined as ProductWithPromotion
    }
  },
  actions: {
    list(products: Array<Product>) {
      this.items = products
      this.items.forEach((i) => {
        this.stock[i.cip13] = i.availableStock
      })
    },
    add(product: Product) {
      this.items.push(product)
    },
    setCurrent(product: ProductWithPromotion) {
      this.current = JSON.parse(JSON.stringify(product))
    },
    edit(product: Product) {
      this.items = this.items.map((c) => {
        return c.uuid === product.uuid ? product : c
      })
    }
  }
})
