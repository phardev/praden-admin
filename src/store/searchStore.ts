import { HashTable } from '@core/types/types'
import { defineStore } from 'pinia'

export interface SearchPagination {
  total: number
  from: number
  hasMore: boolean
}

export const useSearchStore = defineStore('SearchStore', {
  state: () => {
    return {
      items: {} as HashTable<Array<any>>,
      filters: {} as HashTable<Array<any>>,
      errors: {} as HashTable<string | undefined>,
      loading: {} as HashTable<boolean>,
      pagination: {} as HashTable<SearchPagination>
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
    },
    getPagination: (state) => {
      return (key: string): SearchPagination | undefined => {
        return state.pagination[key]
      }
    },
    hasMoreSearch: (state) => {
      return (key: string): boolean => {
        return state.pagination[key]?.hasMore ?? false
      }
    }
  },
  actions: {
    set(key: string, value: Array<any>) {
      this.items[key] = value
    },
    append(key: string, value: Array<any>) {
      const existing = this.items[key] ?? []
      this.items[key] = [...existing, ...value]
    },
    setFilter(key: string, value: any) {
      this.filters[key] = value
    },
    setError(key: string, value: string | undefined) {
      this.errors[key] = value
    },
    setPagination(key: string, pagination: SearchPagination) {
      this.pagination[key] = pagination
    },
    startLoading(key: string) {
      this.loading[key] = true
    },
    endLoading(key: string) {
      this.loading[key] = false
    },
    clear(key: string) {
      delete this.items[key]
      delete this.pagination[key]
    }
  }
})
