import { ShowcaseKind, ShowcaseProduct } from '@core/entities/homepageShowcase'
import { defineStore } from 'pinia'

export const useHomepageShowcaseStore = defineStore('HomepageShowcaseStore', {
  state: () => {
    return {
      showcases: {} as Partial<Record<ShowcaseKind, Array<ShowcaseProduct>>>,
      isLoading: false,
      error: null as string | null
    }
  },
  getters: {
    get: (state) => {
      return (kind: ShowcaseKind): Array<ShowcaseProduct> =>
        state.showcases[kind] ?? []
    }
  },
  actions: {
    setShowcase(kind: ShowcaseKind, products: Array<ShowcaseProduct>) {
      this.showcases[kind] = JSON.parse(JSON.stringify(products))
      this.error = null
    },
    startLoading() {
      this.isLoading = true
      this.error = null
    },
    stopLoading() {
      this.isLoading = false
    },
    setError(error: string) {
      this.error = error
      this.isLoading = false
    }
  }
})
