import type { CartDetail } from '@core/entities/cart'
import type { Customer } from '@core/entities/customer'
import type { Product } from '@core/entities/product'
import { defineStore } from 'pinia'

export interface ManualOrderDraft {
  cart: CartDetail
  customer?: Customer
  products: Array<Product>
}

export const useManualOrderDraftStore = defineStore('ManualOrderDraftStore', {
  state: () => {
    return {
      draft: undefined as ManualOrderDraft | undefined
    }
  },
  actions: {
    set(draft: ManualOrderDraft) {
      this.draft = JSON.parse(JSON.stringify(draft))
    }
  }
})
