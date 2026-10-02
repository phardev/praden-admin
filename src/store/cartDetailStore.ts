import type { Cart, CartAction, CartDetail } from '@core/entities/cart'
import { defineStore } from 'pinia'

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export const useCartDetailStore = defineStore('CartDetailStore', {
  state: () => {
    return {
      current: undefined as CartDetail | undefined,
      isLoading: false as boolean,
      pendingAction: undefined as CartAction | undefined
    }
  },
  actions: {
    startLoading() {
      this.current = undefined
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    setCurrent(cart: CartDetail) {
      this.current = copy(cart)
    },
    replace(cart: Cart) {
      const { status, customer } = this.current ?? {}
      this.current = {
        ...copy(cart),
        ...(status && { status }),
        ...(customer && { customer })
      }
    },
    startAction(action: CartAction) {
      this.pendingAction = action
    },
    stopAction() {
      this.pendingAction = undefined
    }
  }
})
