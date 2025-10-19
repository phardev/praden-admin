import { defineStore } from 'pinia'
import { Location } from '@core/entities/location'

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
