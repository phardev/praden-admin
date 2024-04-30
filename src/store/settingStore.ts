import { defineStore } from 'pinia'
import { HashTable } from '@core/types/types'

export const useSettingStore = defineStore('SettingStore', {
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
      this.items[key] = value
    }
  }
})
