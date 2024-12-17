import { defineStore } from 'pinia'
import { Category, CategoryWithProducts } from '@core/entities/category'
import { Product } from '@core/entities/product'

export const useCategoryStore = defineStore('CategoryStore', {
  state: () => {
    return {
      items: [] as Array<Category>,
      current: undefined as CategoryWithProducts | undefined,
      isLoading: false
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: string): Category | undefined => {
        return state.items.find((c) => c.uuid === uuid)
      }
    }
  },
  actions: {
    list(categories: Array<Category>) {
      this.items = categories
    },
    add(category: Category) {
      this.items.push(category)
    },
    edit(category: Category) {
      this.items = this.items.map((c) => {
        return c.uuid === category.uuid ? category : c
      })
    },
    setCurrentCategory(category: Category) {
      if (!this.current) {
        this.current = { products: [] }
      }
      this.current.category = JSON.parse(JSON.stringify(category))
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    addProducts(products: Array<Product>) {
      if (!this.current) {
        this.current = {
          products: []
        }
      }
      const toPush = products.filter(
        (product) =>
          !this.current.products.map((p) => p.uuid).includes(product.uuid)
      )
      this.current.products.push(...toPush)
    }
  }
})
