import { defineStore } from 'pinia'

import { Promotion } from '@core/entities/promotion'

export const usePromotionStore = defineStore('PromotionStore', {
  state: () => {
    return {
      items: [] as Array<Promotion>
    }
  },
  actions: {
    list(promotions: Array<Promotion>) {
      this.items = promotions
    },
    add(promotion: Promotion) {
      this.items.push(promotion)
    }
  }
})
