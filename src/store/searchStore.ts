import { HashTable } from '@core/types/types'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('SearchStore', {
  state: () => {
    return {
      items: {} as HashTable<Array<any>>,
      filters: {} as HashTable<Array<any>>,
      errors: {} as HashTable<string | undefined>,
      loading: {} as HashTable<boolean>
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
    },
    isLoading: (state) => {
      return (key: string): boolean => {
        return state.loading[key] || false
      }
    }
  },
  actions: {
    set(key: string, value: Array<any> | undefined) {
      if (value === undefined) {
        delete this.items[key]
      } else {
        this.items[key] = value
      }
    },
    setFilter(key: string, value: any) {
      this.filters[key] = value
    },
    setError(key: string, value: string | undefined) {
      this.errors[key] = value
    },
    startLoading(key: string) {
      this.loading[key] = true
    },
    endLoading(key: string) {
      this.loading[key] = false
    },
    clear(key: string) {
      delete this.items[key]
    }
  }
})
