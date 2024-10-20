import { defineStore } from 'pinia'
import { HashTable } from '@core/types/types'

export const useSearchStore = defineStore('SearchStore', {
  state: () => {
    return {
      items: {} as HashTable<Array<any>>,
      filters: {} as HashTable<Array<any>>,
      errors: {} as HashTable<string | undefined>
    }
  },
  getters: {
    get: (state) => {
      return (key: string): Array<any> => {
        return state.items[key]
      }
    },
    getFilter: (state) => {
      return (key: string): any => {
        return state.filters[key]
      }
    },
    getError: (state) => {
      return (key: string): any => {
        return state.errors[key]
      }
    }
  },
  actions: {
    set(key: string, value: Array<any> | undefined) {
      this.items[key] = value
    },
    setFilter(key: string, value: any) {
      this.filters[key] = value
    },
    setError(key: string, value: string | undefined) {
      this.errors[key] = value
    }
  }
})
