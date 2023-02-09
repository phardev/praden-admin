import { defineStore } from 'pinia'
import { Category } from '../core/entities/category'

export const useCategoryStore = defineStore('CategoryStore', {
  state: () => {
    return {
      items: [] as Array<Category>
    }
  }
})
