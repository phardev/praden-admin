import { defineStore } from 'pinia'
import { HashTable } from '@core/types/types'

export const useFormStore = defineStore('FormStore', {
  state: () => {
    return {
      items: {} as HashTable<any>
    }
  },
  getters: {
    get: (state) => {
      return (key: string): any => {
        return state.items[key]
      }
    }
  },
  actions: {
    set(key: string, value: any) {
      this.items[key] = Object.assign({}, this.items[key], value)
    }
  }
})
