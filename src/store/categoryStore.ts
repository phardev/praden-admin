import { defineStore } from 'pinia'
import { Category, CategoryWithProducts } from '@core/entities/category'

export const useCategoryStore = defineStore('CategoryStore', {
  state: () => {
    return {
      items: [] as Array<Category>,
      current: undefined as CategoryWithProducts | undefined
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
    setCurrent(category: CategoryWithProducts) {
      this.current = JSON.parse(JSON.stringify(category))
    }
  }
})
