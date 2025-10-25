import { Location } from '@core/entities/location'
import { defineStore } from 'pinia'

export const useLocationStore = defineStore('LocationStore', {
  state: () => {
    return {
      items: [] as Array<Location>,
      isLoading: false
    }
  },
  actions: {
    list(locations: Array<Location>) {
      this.items = locations
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
