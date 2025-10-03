import { defineStore } from 'pinia'

export const useSystemResourceStore = defineStore('SystemResourceStore', {
  state: () => {
    return {
      items: [] as Array<string>,
      isLoading: false
    }
  },
  actions: {
    list(systemResources: Array<string>) {
      this.items = systemResources
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
