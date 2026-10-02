import {
  type ErrorMessageVM,
  errorBodyOf
} from '@adapters/primary/view-models/orders/manual-order-error/manualOrderErrorMessageVM'

export interface CartErrorMessageVM extends ErrorMessageVM {
  cartOutdated: boolean
}

const GENERIC_ERROR_KEY = 'customers.cart.error'

const keysByCartCode: Record<string, string> = {
  CART_NOT_FOUND: 'customers.cart.errors.notFound',
  CART_EMPTY: 'customers.cart.errors.empty',
  CART_CLOSED: 'customers.cart.errors.closed'
}

export const cartErrorMessageVM = (error: unknown): CartErrorMessageVM => {
  const cartKey = keysByCartCode[String(errorBodyOf(error).code)]
  return {
    key: cartKey ?? GENERIC_ERROR_KEY,
    params: {},
    cartOutdated: cartKey !== undefined
  }
}
