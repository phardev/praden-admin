import { defineStore } from 'pinia'
import { Location } from '@core/entities/location'

export const useLocationStore = defineStore('LocationStore', {
  state: () => {
    return {
      items: [] as Array<Location>
    }
  },
  actions: {
    list(locations: Array<Location>) {
      this.items = locations
    }
  }
})
