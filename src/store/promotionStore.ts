import { Promotion } from '@core/entities/promotion'
import { PromotionListItem } from '@core/usecases/promotions/promotions-listing/promotionListItem'
import { defineStore } from 'pinia'

const toListItem = (promotion: Promotion): PromotionListItem => {
  const listItem: PromotionListItem = {
    uuid: promotion.uuid,
    name: promotion.name,
    type: promotion.type,
    amount: promotion.amount,
    productCount: promotion.products.length
  }
  if (promotion.startDate !== undefined) {
    listItem.startDate = promotion.startDate
  }
  if (promotion.endDate !== undefined) {
    listItem.endDate = promotion.endDate
  }
  return listItem
}

export const usePromotionStore = defineStore('PromotionStore', {
  state: () => {
    return {
      items: [] as Array<PromotionListItem>,
      current: undefined as Promotion | undefined,
      isLoading: false
    }
  },
  getters: {
    getByUuid: (state) => {
      return (uuid: string): PromotionListItem | undefined => {
        return state.items.find((item) => item.uuid === uuid)
      }
    }
  },
  actions: {
    list(promotions: Array<PromotionListItem>) {
      this.items = promotions
    },
    add(promotion: Promotion) {
      this.current = promotion
      this.items.push(toListItem(promotion))
    },
    edit(promotion: Promotion) {
      this.current = promotion
      this.items = this.items.map((item) => {
        return item.uuid === promotion.uuid ? toListItem(promotion) : item
      })
    },
    setCurrent(promotion: Promotion) {
      this.current = JSON.parse(JSON.stringify(promotion))
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  }
})
