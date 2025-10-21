import { defineStore } from 'pinia'
import { Product, ProductWithPromotion, Stock } from '@core/entities/product'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'

export const useProductStore = defineStore('ProductStore', {
  state: () => {
    return {
      items: [] as Array<ProductListItem>,
      stock: {} as Stock,
      current: undefined as ProductWithPromotion | undefined,
      hasMore: false as boolean,
      isLoading: false
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: string): ProductListItem | undefined => {
        return state.items.find((c) => c.uuid === uuid)
      }
    }
  },
  actions: {
    list(products: Array<ProductListItem>) {
      products.forEach((p) => {
        const existingProduct = this.items.find((item) => item.uuid === p.uuid)
        if (existingProduct) {
          this.items = this.items.map((c) => {
            return c.uuid === p.uuid ? p : c
          })
        } else {
          this.items.push(p)
        }
        this.stock[p.ean13] = p.availableStock
      })
      this.hasMore = products.length > 0
    },
    add(product: Product) {
      this.items.push(toListItem(product))
    },
    setCurrent(product: ProductWithPromotion) {
      this.current = JSON.parse(JSON.stringify(product))
    },
    edit(product: Product) {
      this.items = this.items.map((c) => {
        return c.uuid === product.uuid ? toListItem(product) : c
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

const toListItem = (product: Product): ProductListItem => {
  const listItem: ProductListItem = {
    uuid: product.uuid,
    name: product.name,
    ean13: product.ean13,
    categories: product.categories.map((c) => ({
      uuid: c.uuid,
      name: c.name
    })),
    priceWithoutTax: product.priceWithoutTax,
    percentTaxRate: product.percentTaxRate,
    availableStock: product.availableStock,
    status: product.status,
    flags: product.flags,
    miniature: product.miniature,
    isMedicine: product.isMedicine
  }
  if (product.laboratory) {
    listItem.laboratory = {
      uuid: product.laboratory.uuid,
      name: product.laboratory.name
    }
  }
  return listItem
}
