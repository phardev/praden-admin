import {
  type Cart,
  type CartCode,
  CartCodeStatus,
  type CartLine
} from '@core/entities/cart'
import type { Customer } from '@core/entities/customer'
import type { Address, DeliveryMethod } from '@core/entities/order'
import type { Product } from '@core/entities/product'
import type { RelayPoint } from '@core/entities/relayPoint'
import type { Timestamp } from '@core/types/types'
import { ManualOrderPaymentMode } from '@core/usecases/order/manual-order-creation/createManualOrder'
import {
  customerPrefilledAddress,
  emptyOrderCreateFormState,
  type OrderCreateFormLine,
  type OrderCreateFormState
} from './orderCreateFormState'
import { availablePickingHours } from './pickingSlotsVM'
import { promotionCodeBasisOf } from './promotionCodeBasis'

interface PickingSlot {
  pickingDate?: Timestamp
  pickingHour?: string
}

const lineOf = (
  line: CartLine,
  products: Array<Product>
): Array<OrderCreateFormLine> => {
  const product = products.find((p) => p.uuid === line.productUuid)
  if (!product) {
    return []
  }
  return [
    {
      product,
      quantity: line.quantity,
      ...(line.promotion && {
        promotions: [
          {
            uuid: line.promotion.uuid,
            type: line.promotion.type,
            amount: line.promotion.amount
          }
        ]
      })
    }
  ]
}

const relayPointOf = (cart: Cart): RelayPoint | undefined => {
  if (!cart.delivery?.pickupId) {
    return undefined
  }
  return {
    id: cart.delivery.pickupId,
    name: cart.delivery.pickupName ?? '',
    address: '',
    zipCode: '',
    city: ''
  }
}

const startOfDay = (timestamp: Timestamp): Timestamp => {
  const day = new Date(timestamp)
  day.setHours(0, 0, 0, 0)
  return day.getTime()
}

const hourOf = (timestamp: Timestamp): string => {
  const date = new Date(timestamp)
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const pickingSlotOf = (cart: Cart, now: Timestamp): PickingSlot => {
  const pickingDate = cart.delivery?.pickingDate
  if (pickingDate === undefined || startOfDay(pickingDate) < startOfDay(now)) {
    return {}
  }
  const day = startOfDay(pickingDate)
  const hour = hourOf(pickingDate)
  return availablePickingHours(day, now).includes(hour)
    ? { pickingDate: day, pickingHour: hour }
    : {}
}

const isSameAddress = (a: Address, b: Address): boolean =>
  JSON.stringify(a) === JSON.stringify(b)

const appliedCodeOf = (code?: CartCode): CartCode | undefined =>
  code?.status === CartCodeStatus.Applied ? code : undefined

export const orderCreateFormStateFromCart = (
  customer: Customer,
  cart: Cart,
  products: Array<Product>,
  deliveryMethods: Array<DeliveryMethod>,
  now: Timestamp
): OrderCreateFormState => {
  const customerAddress = customerPrefilledAddress(customer)
  const deliveryAddress = cart.deliveryAddress ?? customerAddress
  const billingAddress = cart.billingAddress ?? deliveryAddress
  const deliveryMethod = deliveryMethods.find(
    (method) => method.uuid === cart.delivery?.methodUuid
  )
  const relayPoint = relayPointOf(cart)
  const promotionCode = appliedCodeOf(cart.promotionCode)
  const state: OrderCreateFormState = {
    ...emptyOrderCreateFormState(),
    customer,
    lines: cart.lines.flatMap((line) => lineOf(line, products)),
    ...(deliveryMethod && { deliveryMethod }),
    ...(relayPoint && { selectedRelayPoint: relayPoint }),
    deliveryAddress: { ...deliveryAddress },
    billingAddress: { ...billingAddress },
    billingSameAsDelivery: isSameAddress(deliveryAddress, billingAddress),
    contact: cart.contact
      ? { ...cart.contact }
      : { email: customer.email, phone: customer.phone ?? '' },
    ...pickingSlotOf(cart, now),
    paymentMode: ManualOrderPaymentMode.PaymentLink,
    voucherCode: appliedCodeOf(cart.voucher)?.code ?? '',
    ...(cart.customerMessage && { customerMessage: cart.customerMessage }),
    ...(cart.uuid && { cartUuid: cart.uuid })
  }
  if (!promotionCode) {
    return state
  }
  return {
    ...state,
    promotionCode: {
      code: promotionCode.code,
      discount: promotionCode.discount,
      basis: promotionCodeBasisOf(state)
    }
  }
}

export const unavailableCartProductNames = (
  cart: Cart,
  products: Array<Product>
): string =>
  cart.lines
    .filter((line) => !products.some((p) => p.uuid === line.productUuid))
    .map((line) => line.name)
    .join(', ')
