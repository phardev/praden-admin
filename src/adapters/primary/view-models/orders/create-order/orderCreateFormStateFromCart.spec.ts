import { type Cart, CartCodeStatus, type CartLine } from '@core/entities/cart'
import { ReductionType } from '@core/entities/promotion'
import { ManualOrderPaymentMode } from '@core/usecases/order/manual-order-creation/createManualOrder'
import { elodieCart, elodieCartReadyToOrder } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import {
  clickAndCollect,
  deliveryInRelayPointDPD
} from '@utils/testData/deliveryMethods'
import { chamomilla, dolodent } from '@utils/testData/products'
import {
  emptyAddress,
  emptyOrderCreateFormState,
  type OrderCreateFormState
} from './orderCreateFormState'
import {
  orderCreateFormStateFromCart,
  unavailableCartProductNames
} from './orderCreateFormStateFromCart'
import { promotionCodeBasisOf } from './promotionCodeBasis'

describe('Order create form state from cart', () => {
  const now = new Date('2026-09-26T08:00:00.000Z').getTime()
  const deliveryMethods = [clickAndCollect, deliveryInRelayPointDPD]

  it('should prefill everything the customer prepared for a relay delivery', () => {
    expect(
      orderCreateFormStateFromCart(
        elodieDurand,
        elodieCartReadyToOrder,
        [dolodent],
        deliveryMethods,
        now
      )
    ).toStrictEqual<OrderCreateFormState>({
      ...emptyOrderCreateFormState(),
      customer: elodieDurand,
      lines: [{ product: dolodent, quantity: 2 }],
      deliveryMethod: deliveryInRelayPointDPD,
      selectedRelayPoint: {
        id: elodieCartReadyToOrder.delivery!.pickupId!,
        name: elodieCartReadyToOrder.delivery!.pickupName!,
        address: '',
        zipCode: '',
        city: ''
      },
      deliveryAddress: elodieCartReadyToOrder.deliveryAddress!,
      billingAddress: elodieCartReadyToOrder.billingAddress!,
      billingSameAsDelivery: false,
      contact: elodieCartReadyToOrder.contact!,
      paymentMode: ManualOrderPaymentMode.PaymentLink,
      voucherCode: elodieCartReadyToOrder.voucher!.code,
      customerMessage: elodieCartReadyToOrder.customerMessage,
      cartUuid: elodieCartReadyToOrder.uuid
    })
  })

  it('should fall back on the customer details when the cart has none', () => {
    const state = orderCreateFormStateFromCart(
      elodieDurand,
      { ...elodieCart, lines: [elodieCart.lines[0]] },
      [dolodent],
      deliveryMethods,
      now
    )
    const customerAddress = {
      ...emptyAddress(),
      firstname: elodieDurand.firstname,
      lastname: elodieDurand.lastname
    }
    expect({
      deliveryAddress: state.deliveryAddress,
      billingAddress: state.billingAddress,
      billingSameAsDelivery: state.billingSameAsDelivery,
      contact: state.contact
    }).toStrictEqual({
      deliveryAddress: customerAddress,
      billingAddress: customerAddress,
      billingSameAsDelivery: true,
      contact: { email: elodieDurand.email, phone: elodieDurand.phone }
    })
  })

  it('should keep the product promotion shown in the cart', () => {
    const promotedLine: CartLine = elodieCart.lines[1]
    const state = orderCreateFormStateFromCart(
      elodieDurand,
      { ...elodieCart, lines: [promotedLine] },
      [chamomilla],
      deliveryMethods,
      now
    )
    expect(state.lines).toStrictEqual([
      {
        product: chamomilla,
        quantity: promotedLine.quantity,
        promotions: [
          {
            uuid: promotedLine.promotion!.uuid,
            type: ReductionType.Fixed,
            amount: promotedLine.promotion!.amount
          }
        ]
      }
    ])
  })

  it('should leave out a product that is no longer in the catalog', () => {
    const state = orderCreateFormStateFromCart(
      elodieDurand,
      elodieCart,
      [dolodent],
      deliveryMethods,
      now
    )
    expect(state.lines).toStrictEqual([
      { product: dolodent, quantity: elodieCart.lines[0].quantity }
    ])
  })

  it('should carry an applied promotion code with its discount', () => {
    const cart: Cart = {
      ...elodieCartReadyToOrder,
      promotionCode: {
        code: 'BIENVENUE',
        status: CartCodeStatus.Applied,
        discount: 200
      }
    }
    const state = orderCreateFormStateFromCart(
      elodieDurand,
      cart,
      [dolodent],
      deliveryMethods,
      now
    )
    expect(state.promotionCode).toStrictEqual({
      code: 'BIENVENUE',
      discount: 200,
      basis: promotionCodeBasisOf(state)
    })
  })

  it('should keep the pickup slot chosen by the customer while it is still offered', () => {
    const cart: Cart = {
      ...elodieCartReadyToOrder,
      delivery: {
        methodUuid: clickAndCollect.uuid,
        pickingDate: new Date('2026-09-28T14:30:00.000Z').getTime()
      }
    }
    const state = orderCreateFormStateFromCart(
      elodieDurand,
      cart,
      [dolodent],
      deliveryMethods,
      now
    )
    expect({
      pickingDate: state.pickingDate,
      pickingHour: state.pickingHour
    }).toStrictEqual({
      pickingDate: new Date('2026-09-28T00:00:00.000Z').getTime(),
      pickingHour: '14:30'
    })
  })

  it('should let the staff choose again a pickup slot no longer offered', () => {
    const cart: Cart = {
      ...elodieCartReadyToOrder,
      delivery: {
        methodUuid: clickAndCollect.uuid,
        pickingDate: new Date('2026-09-26T09:30:00.000Z').getTime()
      }
    }
    const state = orderCreateFormStateFromCart(
      elodieDurand,
      cart,
      [dolodent],
      deliveryMethods,
      now
    )
    expect({
      pickingDate: state.pickingDate,
      pickingHour: state.pickingHour
    }).toStrictEqual({ pickingDate: undefined, pickingHour: undefined })
  })

  it('should name the products of the cart no longer in the catalog', () => {
    expect(unavailableCartProductNames(elodieCart, [dolodent])).toStrictEqual(
      elodieCart.lines[1].name
    )
  })

  it('should name the unavailable products one after the other', () => {
    expect(unavailableCartProductNames(elodieCart, [])).toStrictEqual(
      `${elodieCart.lines[0].name}, ${elodieCart.lines[1].name}`
    )
  })
})
