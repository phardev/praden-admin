import { defineStore } from 'pinia'
import { Product, ProductWithPromotion, Stock } from '@core/entities/product'

export const useProductStore = defineStore('ProductStore', {
  state: () => {
    return {
      items: [] as Array<Product>,
      stock: {} as Stock,
      current: undefined as ProductWithPromotion,
      hasMore: false as boolean
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: string): Product | undefined => {
        return state.items.find((c) => c.uuid === uuid)
      }
    }
  },
  actions: {
    list(products: Array<Product>) {
      products.forEach((p) => {
        const existingProduct = this.items.find((item) => item.uuid === p.uuid)
        if (existingProduct) {
          this.edit(p)
        } else {
          this.items.push(p)
        }
        this.stock[p.ean13] = p.availableStock
      })
      this.hasMore = products.length > 0
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
