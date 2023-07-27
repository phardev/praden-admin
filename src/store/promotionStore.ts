import { defineStore } from 'pinia'

import { Promotion } from '@core/usecases/promotions/promotions-listing/promotion'

export const usePromotionStore = defineStore('PromotionStore', {
  state: () => {
    return {
      items: [] as Array<Promotion>
    }
  },
  actions: {
    list(promotions: Array<Promotion>) {
      this.items = promotions
    }
  }
})
