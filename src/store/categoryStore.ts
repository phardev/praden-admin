import { Category, CategoryWithProducts } from '@core/entities/category'
import { Product } from '@core/entities/product'
import { defineStore } from 'pinia'

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
      this.items.sort((a, b) => a.order - b.order)
    },
    edit(category: Category) {
      this.items = this.items
        .map((c) => {
          return c.uuid === category.uuid ? category : c
        })
        .sort((a, b) => a.order - b.order)
    },
    setCurrentCategory(category: Category) {
      this.current = {
        category: JSON.parse(JSON.stringify(category)),
        products: []
      }
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
          category: {
            uuid: '',
            name: '',
            description: '',
            parentUuid: undefined,
            miniature: undefined,
            image: undefined,
            order: 0
          },
          products: []
        }
      }
      const toPush = products.filter(
        (product) =>
          !this.current!.products.map((p) => p.uuid).includes(product.uuid)
      )
      if (toPush.length) {
        this.current!.products.push(...toPush)
      }
    }
  }
})
