import {
  type Cart,
  CartCodeStatus,
  CartEventType,
  CustomerCartAction
} from '@core/entities/cart'
import { useCustomerStore } from '@store/customerStore'
import { priceFormatter, timestampToLocaleString } from '@utils/formatters'
import {
  elodieCart,
  elodieCartReadyToOrder,
  lucasEmptyCart
} from '@utils/testData/carts'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'
import { type CustomerCartVM, getCustomerCartVM } from './getCustomerCartVM'

const euros = (cents: number) =>
  priceFormatter('fr-FR', 'EUR').format(cents / 100)
const dateTime = (timestamp: number) =>
  timestampToLocaleString(timestamp, 'fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

describe('Get customer cart VM', () => {
  let customerStore: ReturnType<typeof useCustomerStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
  })

  it('should show a cart with lines, alerts and missing information', () => {
    customerStore.setCurrent({ ...elodieDurand, currentCart: elodieCart })
    const [dolodentLine, chamomillaLine] = elodieCart.lines
    expect(getCustomerCartVM()).toStrictEqual<CustomerCartVM>({
      hasLines: true,
      lines: [
        {
          productUuid: dolodentLine.productUuid,
          name: dolodentLine.name,
          quantity: dolodentLine.quantity,
          unitPrice: euros(dolodentLine.unitPriceWithTax),
          total: euros(dolodentLine.totalWithTax),
          alertKeys: []
        },
        {
          productUuid: chamomillaLine.productUuid,
          name: chamomillaLine.name,
          quantity: chamomillaLine.quantity,
          unitPrice: euros(chamomillaLine.unitPriceWithTax),
          unitPriceBeforePromotion: euros(
            chamomillaLine.unitPriceWithTaxBeforePromotion
          ),
          total: euros(chamomillaLine.totalWithTax),
          alertKeys: ['customers.cart.alerts.OUT_OF_STOCK']
        }
      ],
      totalQuantity: elodieCart.totalQuantity,
      totals: {
        products: euros(elodieCart.totals.productsWithTax),
        total: euros(elodieCart.totals.total)
      },
      missingKeys: [
        'customers.cart.missing.DELIVERY_METHOD',
        'customers.cart.missing.CONTACT',
        'customers.cart.missing.ADDRESSES',
        'customers.cart.missing.BLOCKING_ALERTS'
      ],
      activity: [
        {
          labelKey: 'customers.cart.events.PRODUCT_ADDED',
          labelParams: {},
          actorKey: 'customers.cart.actors.customer',
          date: dateTime(elodieCart.activity[0].createdAt)
        }
      ],
      lastActivity: dateTime(elodieCart.updatedAt),
      canConvert: true,
      canEditCodes: true,
      isUpdating: false
    })
  })

  it('should explain why the promotion code is refused and show the applied voucher', () => {
    customerStore.setCurrent({
      ...elodieDurand,
      currentCart: elodieCartReadyToOrder
    })
    const vm = getCustomerCartVM()!
    expect({
      promotionCode: vm.promotionCode,
      voucher: vm.voucher,
      totals: vm.totals,
      customerMessage: vm.customerMessage
    }).toStrictEqual({
      promotionCode: {
        code: 'BIENVENUE',
        status: CartCodeStatus.Rejected,
        badgeColor: 'red',
        messageClass: 'text-red-600',
        messageKey:
          'customers.cart.promotionCodeRejections.MINIMUM_AMOUNT_NOT_REACHED',
        messageParams: {
          minimumAmount: euros(3000),
          missingAmount: euros(1900)
        }
      },
      voucher: {
        code: 'BON-10',
        status: CartCodeStatus.Applied,
        badgeColor: 'green',
        messageClass: 'text-green-700',
        messageKey: 'customers.cart.codeApplied',
        messageParams: { discount: euros(1000) }
      },
      totals: {
        products: euros(elodieCartReadyToOrder.totals.productsWithTax),
        delivery: euros(elodieCartReadyToOrder.totals.deliveryWithTax!),
        voucherDiscount: euros(elodieCartReadyToOrder.totals.voucherDiscount),
        total: euros(elodieCartReadyToOrder.totals.total)
      },
      customerMessage: elodieCartReadyToOrder.customerMessage
    })
  })

  it('should tell who acted on the cart and what happened to the codes', () => {
    const cart: Cart = {
      ...elodieCart,
      activity: [
        {
          type: CartEventType.PromotionCodeApplied,
          data: { code: 'BIENVENUE', status: CartCodeStatus.Rejected },
          createdAt: elodieCart.updatedAt,
          createdBy: 'staff-uuid'
        },
        {
          type: CartEventType.CartClosed,
          data: {},
          createdAt: elodieCart.updatedAt,
          createdBy: 'system'
        },
        {
          type: CartEventType.ProductAdded,
          data: {},
          createdAt: elodieCart.updatedAt,
          createdBy: 'guest'
        }
      ]
    }
    customerStore.setCurrent({ ...elodieDurand, currentCart: cart })
    expect(
      getCustomerCartVM()!.activity.map(
        ({ labelKey, labelParams, actorKey }) => ({
          labelKey,
          labelParams,
          actorKey
        })
      )
    ).toStrictEqual([
      {
        labelKey: 'customers.cart.events.PROMOTION_CODE_REJECTED',
        labelParams: { code: 'BIENVENUE' },
        actorKey: 'customers.cart.actors.staff'
      },
      {
        labelKey: 'customers.cart.events.CART_CLOSED',
        labelParams: {},
        actorKey: 'customers.cart.actors.system'
      },
      {
        labelKey: 'customers.cart.events.PRODUCT_ADDED',
        labelParams: {},
        actorKey: 'customers.cart.actors.guest'
      }
    ])
  })

  it('should not offer to convert an empty cart', () => {
    customerStore.setCurrent({ ...lucasLefevre, currentCart: lucasEmptyCart })
    expect(getCustomerCartVM()!.canConvert).toStrictEqual(false)
  })

  it('should not let the staff change the codes of an empty cart', () => {
    customerStore.setCurrent({ ...lucasLefevre, currentCart: lucasEmptyCart })
    expect(getCustomerCartVM()!.canEditCodes).toStrictEqual(false)
  })

  it('should not let the staff change the codes while a code is checked', () => {
    customerStore.setCurrent({ ...elodieDurand, currentCart: elodieCart })
    customerStore.startCartAction(CustomerCartAction.ApplyVoucher)
    expect(getCustomerCartVM()!.canEditCodes).toStrictEqual(false)
  })

  it('should show the cart as updating while a code is checked', () => {
    customerStore.setCurrent({ ...elodieDurand, currentCart: elodieCart })
    customerStore.startCartAction(CustomerCartAction.ApplyVoucher)
    expect(getCustomerCartVM()!.isUpdating).toStrictEqual(true)
  })

  it('should tell which action is in progress', () => {
    customerStore.setCurrent({ ...elodieDurand, currentCart: elodieCart })
    customerStore.startCartAction(CustomerCartAction.ApplyVoucher)
    expect(getCustomerCartVM()!.pendingAction).toStrictEqual(
      CustomerCartAction.ApplyVoucher
    )
  })
})
