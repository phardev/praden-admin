import { defineStore } from 'pinia'
import { HashTable } from '@core/types/types'

export const useSearchStore = defineStore('SearchStore', {
  state: () => {
    return {
      items: {} as HashTable<Array<any>>
    }
  },
  getters: {
    get: (state) => {
      return (key: string): Array<any> => {
        return state.items[key]
      }
    }
  },
  actions: {
    set(key: string, value: Array<any>) {
      this.items[key] = value
    }
  }
})
