import { promotionCodeRejectionMessage } from '@adapters/primary/view-models/carts/promotion-code-rejection/promotionCodeRejectionMessage'
import {
  type Cart,
  type CartActivity,
  type CartCode,
  CartCodeStatus,
  CartEventType,
  type CartLine,
  type CartTotals
} from '@core/entities/cart'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'

export interface CartLineVM {
  productUuid: string
  name: string
  quantity: number
  unitPrice: string
  unitPriceBeforePromotion?: string
  total: string
  alertKeys: Array<string>
}

export interface CartCodeVM {
  code: string
  status: CartCodeStatus
  badgeColor: string
  messageClass: string
  messageKey: string
  messageParams: Record<string, string>
}

export interface CartActivityVM {
  labelKey: string
  labelParams: Record<string, string>
  actorKey: string
  date: string
}

export interface CartTotalsVM {
  products: string
  delivery?: string
  promotionCodeDiscount?: string
  voucherDiscount?: string
  total: string
}

export interface CartContentVM {
  hasLines: boolean
  lines: Array<CartLineVM>
  totalQuantity: number
  totals: CartTotalsVM
  promotionCode?: CartCodeVM
  voucher?: CartCodeVM
  customerMessage?: string
  missingKeys: Array<string>
  activity: Array<CartActivityVM>
  lastActivity: string
}

const SYSTEM_ACTOR = 'system'
const GUEST_ACTOR = 'guest'
const REJECTED_CODE_EVENTS: Partial<Record<CartEventType, string>> = {
  [CartEventType.PromotionCodeApplied]: 'PROMOTION_CODE_REJECTED',
  [CartEventType.VoucherApplied]: 'VOUCHER_REJECTED'
}

const euros = (cents: number): string =>
  priceFormatter('fr-FR', 'EUR').format(cents / 100)

const dateTime = (timestamp: number): string =>
  timestampToLocaleString(timestamp, 'fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

const lineVM = (line: CartLine): CartLineVM => ({
  productUuid: line.productUuid,
  name: line.name,
  quantity: line.quantity,
  unitPrice: euros(line.unitPriceWithTax),
  ...(line.promotion && {
    unitPriceBeforePromotion: euros(line.unitPriceWithTaxBeforePromotion)
  }),
  total: euros(line.totalWithTax),
  alertKeys: line.alerts.map((alert) => `customers.cart.alerts.${alert}`)
})

const APPLIED_STYLE = { badgeColor: 'green', messageClass: 'text-green-700' }
const REJECTED_STYLE = { badgeColor: 'red', messageClass: 'text-red-600' }

const appliedCodeVM = (code: CartCode): CartCodeVM => ({
  code: code.code,
  status: code.status,
  ...APPLIED_STYLE,
  messageKey: 'customers.cart.codeApplied',
  messageParams: { discount: euros(code.discount) }
})

const promotionCodeVM = (code: CartCode): CartCodeVM => {
  if (code.status === CartCodeStatus.Applied) {
    return appliedCodeVM(code)
  }
  const { key, params } = promotionCodeRejectionMessage(code.rejection)
  return {
    code: code.code,
    status: code.status,
    ...REJECTED_STYLE,
    messageKey: key,
    messageParams: params
  }
}

const voucherVM = (code: CartCode): CartCodeVM => {
  if (code.status === CartCodeStatus.Applied) {
    return appliedCodeVM(code)
  }
  return {
    code: code.code,
    status: code.status,
    ...REJECTED_STYLE,
    messageKey: `customers.cart.voucherRejections.${code.rejection?.reason ?? 'UNKNOWN'}`,
    messageParams: {}
  }
}

const actorKeyOf = (createdBy: string, customerUuid?: string): string => {
  if (createdBy === customerUuid) return 'customers.cart.actors.customer'
  if (createdBy === SYSTEM_ACTOR) return 'customers.cart.actors.system'
  if (createdBy === GUEST_ACTOR) return 'customers.cart.actors.guest'
  return 'customers.cart.actors.staff'
}

const eventLabelKey = (activity: CartActivity): string => {
  const rejectedType = REJECTED_CODE_EVENTS[activity.type]
  const type =
    rejectedType && activity.data.status === CartCodeStatus.Rejected
      ? rejectedType
      : activity.type
  return `customers.cart.events.${type}`
}

const activityVM = (
  activity: CartActivity,
  customerUuid?: string
): CartActivityVM => ({
  labelKey: eventLabelKey(activity),
  labelParams:
    typeof activity.data.code === 'string' ? { code: activity.data.code } : {},
  actorKey: actorKeyOf(activity.createdBy, customerUuid),
  date: dateTime(activity.createdAt)
})

const totalsVM = (totals: CartTotals): CartTotalsVM => ({
  products: euros(totals.productsWithTax),
  ...(totals.deliveryWithTax !== null && {
    delivery: euros(totals.deliveryWithTax)
  }),
  ...(totals.promotionCodeDiscount > 0 && {
    promotionCodeDiscount: euros(totals.promotionCodeDiscount)
  }),
  ...(totals.voucherDiscount > 0 && {
    voucherDiscount: euros(totals.voucherDiscount)
  }),
  total: euros(totals.total)
})

export const cartContentVM = (cart: Cart): CartContentVM => ({
  hasLines: cart.lines.length > 0,
  lines: cart.lines.map(lineVM),
  totalQuantity: cart.totalQuantity,
  totals: totalsVM(cart.totals),
  ...(cart.promotionCode && {
    promotionCode: promotionCodeVM(cart.promotionCode)
  }),
  ...(cart.voucher && { voucher: voucherVM(cart.voucher) }),
  ...(cart.customerMessage && { customerMessage: cart.customerMessage }),
  missingKeys: cart.missingForOrder.map(
    (missing) => `customers.cart.missing.${missing}`
  ),
  activity: cart.activity.map((a) => activityVM(a, cart.customerUuid)),
  lastActivity: dateTime(cart.updatedAt)
})
