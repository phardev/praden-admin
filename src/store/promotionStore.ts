import { defineStore } from 'pinia'
import { Promotion } from '@core/entities/promotion'

export const usePromotionStore = defineStore('PromotionStore', {
  state: () => {
    return {
      items: [] as Array<Promotion>,
      current: undefined as Promotion | undefined
    }
  },
  actions: {
    list(promotions: Array<Promotion>) {
      this.items = promotions
    },
    add(promotion: Promotion) {
      this.items.push(promotion)
    },
    edit(promotion: Promotion) {
      this.items = this.items.map((p) => {
        return p.uuid === promotion.uuid ? promotion : p
      })
    },
    setCurrent(promotion: Promotion) {
      this.current = JSON.parse(JSON.stringify(promotion))
    }
  }
})
