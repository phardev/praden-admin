import { defineStore } from 'pinia'

export const useColissimoWidgetStore = defineStore('ColissimoWidgetStore', {
  state: () => {
    return {
      token: null as string | null,
      isLoading: false
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
