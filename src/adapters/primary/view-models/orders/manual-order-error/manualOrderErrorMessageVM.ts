import {
  type ErrorMessageVM,
  promotionCodeRejectionMessage
} from '@adapters/primary/view-models/carts/promotion-code-rejection/promotionCodeRejectionMessage'
import { voucherErrorMessageKey } from '@adapters/primary/view-models/vouchers/voucher-error/voucherErrorMessageVM'
import type { CartCodeRejection } from '@core/entities/cart'

export type { ErrorMessageVM }

const PROMOTION_CODE_CANNOT_BE_APPLIED = 'PROMOTION_CODE_CANNOT_BE_APPLIED'

const keysByCartCode: Record<string, string> = {
  CART_CLOSED: 'orders.create.errors.cartClosed',
  CART_NOT_OF_CUSTOMER: 'orders.create.errors.cartNotOfCustomer',
  CART_NOT_FOUND: 'orders.create.errors.cartNotFound'
}

type ErrorBody = Partial<CartCodeRejection> & { code?: unknown }

export const errorBodyOf = (error: unknown): ErrorBody => {
  const data = (error as { response?: { data?: unknown } })?.response?.data
  return typeof data === 'object' && data !== null ? (data as ErrorBody) : {}
}

export const manualOrderErrorMessageVM = (error: unknown): ErrorMessageVM => {
  const body = errorBodyOf(error)
  const cartKey = keysByCartCode[String(body.code)]
  if (cartKey) {
    return { key: cartKey, params: {} }
  }
  if (body.code === PROMOTION_CODE_CANNOT_BE_APPLIED && body.reason) {
    return promotionCodeRejectionMessage(body)
  }
  return { key: voucherErrorMessageKey(error), params: {} }
}
