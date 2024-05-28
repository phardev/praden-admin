import { defineStore } from 'pinia'
import { Category } from '../core/entities/category'

export const useCategoryStore = defineStore('CategoryStore', {
  state: () => {
    return {
      items: [] as Array<Category>
    }
  },
  actions: {
    list(categories: Array<Category>) {
      this.items = categories
    },
    add(category: Category) {
      this.items.push(category)
    }
  }
})
