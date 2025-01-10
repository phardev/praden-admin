import { PromotionCode } from '@core/usecases/promotion-codes/promotion-code-listing/promotionCode'
import { defineStore } from 'pinia'

export const usePromotionCodeStore = defineStore('PromotionCodeStore', {
  state: () => {
    return {
      items: [] as Array<PromotionCode>,
      current: undefined as PromotionCode,
      isLoading: false
    }
  },
  actions: {
    list(promotionCodes: Array<PromotionCode>) {
      this.items = promotionCodes
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    setCurrent(promotionCode: PromotionCode) {
      this.current = JSON.parse(JSON.stringify(promotionCode))
    },
    create(promotionCode: PromotionCode) {
      this.items.push(promotionCode)
    },
    edit(promotionCode: PromotionCode) {
      this.items = this.items.map((pc) => {
        return pc.uuid === promotionCode.uuid ? promotionCode : pc
      })
    },
    delete(promotionCode: PromotionCode) {
      const index = this.items.findIndex((b) => b.uuid === promotionCode.uuid)
      this.items.splice(index, 1)
      this.items.forEach((b, i) => {
        b.order = i
      })
    }
  }
})
