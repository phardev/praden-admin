import { cartContentVM } from '@adapters/primary/view-models/carts/cart-content/cartContentVM'
import {
  type Cart,
  CartAction,
  CartCodeStatus,
  type CartDetail,
  CartEventType,
  CartListStatus,
  CartMissingInformation
} from '@core/entities/cart'
import { PermissionResource } from '@core/entities/permissionResource'
import type { UserProfile } from '@core/entities/userProfile'
import { useCartDetailStore } from '@store/cartDetailStore'
import { useUserProfileStore } from '@store/userProfileStore'
import { priceFormatter } from '@utils/formatters'
import {
  elodieCart,
  elodieCartDetail,
  elodieCartReadyToOrder,
  guestCartDetail
} from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import {
  adminUserProfile,
  assistantUserProfile
} from '@utils/testData/userProfiles'
import { createPinia, setActivePinia } from 'pinia'
import { type GetCartDetailVM, getCartDetailVM } from './getCartDetailVM'

const euros = (cents: number) =>
  priceFormatter('fr-FR', 'EUR').format(cents / 100)

const customersOnlyUserProfile: UserProfile = {
  ...assistantUserProfile,
  role: {
    ...assistantUserProfile.role,
    permissions: assistantUserProfile.role.permissions.filter(
      (permission) => permission.resource !== PermissionResource.ORDERS
    )
  }
}

describe('Get cart detail VM', () => {
  let cartDetailStore: ReturnType<typeof useCartDetailStore>
  let userProfileStore: ReturnType<typeof useUserProfileStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    cartDetailStore = useCartDetailStore()
    userProfileStore = useUserProfileStore()
    userProfileStore.setCurrent(adminUserProfile)
  })

  it('should show nothing but the loading while the cart is fetched', () => {
    cartDetailStore.startLoading()
    expect(getCartDetailVM()).toStrictEqual<GetCartDetailVM>({
      isLoading: true
    })
  })

  it('should present the cart of a customer ready to be ordered', () => {
    cartDetailStore.setCurrent(elodieCartDetail)
    expect(getCartDetailVM()).toStrictEqual<GetCartDetailVM>({
      isLoading: false,
      cart: {
        ...cartContentVM(elodieCartDetail),
        titleKey: 'carts.detail.customerTitle',
        titleParams: { name: 'Élodie Durand' },
        customerLink: `/customers/get/${elodieDurand.uuid}`,
        contact: elodieCartDetail.contact!,
        isAnonymous: false,
        status: { labelKey: 'carts.status.OPEN', color: 'green' },
        deliveryAddress: [
          'Élodie Durand',
          '3 place du Marché',
          '69002 Lyon',
          'France'
        ],
        pickupName: elodieCartDetail.delivery!.pickupName!,
        readiness: [
          { labelKey: 'carts.detail.readiness.DELIVERY_METHOD', done: true },
          { labelKey: 'carts.detail.readiness.CONTACT', done: true },
          { labelKey: 'carts.detail.readiness.ADDRESSES', done: true }
        ],
        convertLink: `/orders/new?cart=${elodieCartDetail.uuid}`,
        cartLink: `/customers/carts/${elodieCartDetail.uuid}`,
        customerUuid: elodieDurand.uuid,
        canEditCodes: true,
        isUpdating: false
      }
    })
  })

  it('should present the abandoned cart of a visitor who left their contact', () => {
    cartDetailStore.setCurrent(guestCartDetail)
    expect(getCartDetailVM()).toStrictEqual<GetCartDetailVM>({
      isLoading: false,
      cart: {
        ...cartContentVM(guestCartDetail),
        titleKey: 'carts.detail.guestTitle',
        titleParams: {},
        contact: guestCartDetail.contact!,
        isAnonymous: false,
        status: { labelKey: 'carts.status.ABANDONED', color: 'amber' },
        readiness: [
          { labelKey: 'carts.detail.readiness.DELIVERY_METHOD', done: false },
          { labelKey: 'carts.detail.readiness.CONTACT', done: true },
          { labelKey: 'carts.detail.readiness.ADDRESSES', done: false }
        ],
        convertLink: `/orders/new?cart=${guestCartDetail.uuid}`,
        cartLink: `/customers/carts/${guestCartDetail.uuid}`,
        canEditCodes: false,
        isUpdating: false
      }
    })
  })

  it('should explain why the promotion code is refused and show the applied voucher', () => {
    cartDetailStore.setCurrent(elodieCartDetail)
    const cart = getCartDetailVM().cart!
    expect({
      promotionCode: cart.promotionCode,
      voucher: cart.voucher,
      totals: cart.totals,
      customerMessage: cart.customerMessage
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

  it('should show the discount of an applied promotion code in the totals', () => {
    const cart: Cart = {
      ...elodieCartReadyToOrder,
      promotionCode: {
        code: 'BIENVENUE',
        status: CartCodeStatus.Applied,
        discount: 200
      },
      totals: {
        ...elodieCartReadyToOrder.totals,
        promotionCodeDiscount: 200,
        total: elodieCartReadyToOrder.totals.total - 200
      }
    }
    cartDetailStore.setCurrent(cart)
    const vm = getCartDetailVM().cart!
    expect({
      promotionCode: vm.promotionCode,
      totals: vm.totals
    }).toStrictEqual({
      promotionCode: {
        code: 'BIENVENUE',
        status: CartCodeStatus.Applied,
        badgeColor: 'green',
        messageClass: 'text-green-700',
        messageKey: 'customers.cart.codeApplied',
        messageParams: { discount: euros(200) }
      },
      totals: {
        products: euros(cart.totals.productsWithTax),
        delivery: euros(cart.totals.deliveryWithTax!),
        promotionCodeDiscount: euros(200),
        voucherDiscount: euros(cart.totals.voucherDiscount),
        total: euros(cart.totals.total)
      }
    })
  })

  it('should explain why the voucher is refused', () => {
    cartDetailStore.setCurrent({
      ...elodieCartReadyToOrder,
      voucher: {
        code: 'BON-10',
        status: CartCodeStatus.Rejected,
        discount: 0,
        rejection: { reason: 'EXPIRED' }
      }
    })
    expect(getCartDetailVM().cart!.voucher).toStrictEqual({
      code: 'BON-10',
      status: CartCodeStatus.Rejected,
      badgeColor: 'red',
      messageClass: 'text-red-600',
      messageKey: 'customers.cart.voucherRejections.EXPIRED',
      messageParams: {}
    })
  })

  it('should tell who acted on the cart and what happened to the codes', () => {
    cartDetailStore.setCurrent({
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
        },
        {
          type: CartEventType.ProductAdded,
          data: {},
          createdAt: elodieCart.updatedAt,
          createdBy: elodieCart.customerUuid!
        }
      ]
    })
    expect(
      getCartDetailVM().cart!.activity.map(
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
      },
      {
        labelKey: 'customers.cart.events.PRODUCT_ADDED',
        labelParams: {},
        actorKey: 'customers.cart.actors.customer'
      }
    ])
  })

  it('should not let the staff change the codes of an empty cart', () => {
    cartDetailStore.setCurrent({
      ...elodieCartDetail,
      lines: [],
      totalQuantity: 0,
      missingForOrder: [CartMissingInformation.Lines]
    })
    expect(getCartDetailVM().cart!.canEditCodes).toStrictEqual(false)
  })

  it('should not let the staff change the codes of a cart already ordered', () => {
    cartDetailStore.setCurrent({
      ...elodieCartDetail,
      orderUuid: 'elodie-paid-order'
    })
    expect(getCartDetailVM().cart!.canEditCodes).toStrictEqual(false)
  })

  it('should not let the staff change the codes while a code is checked', () => {
    cartDetailStore.setCurrent(elodieCartDetail)
    cartDetailStore.startAction(CartAction.ApplyVoucher)
    expect(getCartDetailVM().cart!.canEditCodes).toStrictEqual(false)
  })

  it('should show the cart as updating with the action in progress', () => {
    cartDetailStore.setCurrent(elodieCartDetail)
    cartDetailStore.startAction(CartAction.ApplyVoucher)
    const cart = getCartDetailVM().cart!
    expect({
      isUpdating: cart.isUpdating,
      pendingAction: cart.pendingAction
    }).toStrictEqual({
      isUpdating: true,
      pendingAction: CartAction.ApplyVoucher
    })
  })

  it('should not link to the page of a cart never saved', () => {
    const { uuid: _neverSaved, ...emptyCart } = {
      ...elodieCartDetail,
      lines: [],
      totalQuantity: 0
    }
    cartDetailStore.setCurrent(emptyCart)
    expect(getCartDetailVM().cart!.cartLink).toStrictEqual(undefined)
  })

  it('should not offer to order an anonymous visitor cart', () => {
    const { contact: _unknown, ...anonymousCart } = guestCartDetail
    cartDetailStore.setCurrent(anonymousCart)
    const cart = getCartDetailVM().cart!
    expect({
      isAnonymous: cart.isAnonymous,
      convertLink: cart.convertLink
    }).toStrictEqual({ isAnonymous: true, convertLink: undefined })
  })

  it('should lead to the order of a cart already ordered instead of offering to order it', () => {
    const orderedCart: CartDetail = {
      ...elodieCartDetail,
      orderUuid: 'elodie-paid-order',
      status: CartListStatus.Closed
    }
    cartDetailStore.setCurrent(orderedCart)
    const cart = getCartDetailVM().cart!
    expect({
      orderLink: cart.orderLink,
      convertLink: cart.convertLink,
      readiness: cart.readiness,
      status: cart.status
    }).toStrictEqual({
      orderLink: '/orders/elodie-paid-order',
      convertLink: undefined,
      readiness: [],
      status: { labelKey: 'carts.status.CLOSED', color: 'gray' }
    })
  })

  it('should not offer to order without the orders permission', () => {
    userProfileStore.setCurrent(customersOnlyUserProfile)
    cartDetailStore.setCurrent(elodieCartDetail)
    expect(getCartDetailVM().cart!.convertLink).toStrictEqual(undefined)
  })

  it('should not offer to order an empty cart', () => {
    cartDetailStore.setCurrent({
      ...elodieCartDetail,
      lines: [],
      totalQuantity: 0,
      missingForOrder: [CartMissingInformation.Lines]
    })
    expect(getCartDetailVM().cart!.convertLink).toStrictEqual(undefined)
  })

  it('should list what blocks the order after the steps to complete', () => {
    cartDetailStore.setCurrent({
      ...elodieCartDetail,
      missingForOrder: elodieCart.missingForOrder
    })
    expect(getCartDetailVM().cart!.readiness).toStrictEqual([
      { labelKey: 'carts.detail.readiness.DELIVERY_METHOD', done: false },
      { labelKey: 'carts.detail.readiness.CONTACT', done: false },
      { labelKey: 'carts.detail.readiness.ADDRESSES', done: false },
      { labelKey: 'carts.detail.readiness.BLOCKING_ALERTS', done: false }
    ])
  })

  it('should name a customer by email when the name is unknown', () => {
    cartDetailStore.setCurrent({
      ...elodieCartDetail,
      customer: { uuid: elodieDurand.uuid, email: elodieDurand.email }
    })
    expect(getCartDetailVM().cart!.titleParams).toStrictEqual({
      name: elodieDurand.email
    })
  })
})
