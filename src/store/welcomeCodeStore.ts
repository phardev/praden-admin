import { WelcomeCode } from '@core/entities/welcomeCode'
import { defineStore } from 'pinia'

export const useWelcomeCodeStore = defineStore('WelcomeCodeStore', {
  state: () => {
    return {
      items: [] as Array<WelcomeCode>,
      isLoading: false,
      isSaving: false
    }
  },
  actions: {
    list(welcomeCodes: Array<WelcomeCode>) {
      this.items = welcomeCodes
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    startSaving() {
      this.isSaving = true
    },
    stopSaving() {
      this.isSaving = false
    }
  }
})
