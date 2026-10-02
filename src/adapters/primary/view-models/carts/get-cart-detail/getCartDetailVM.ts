import {
  type CartContentVM,
  cartContentVM
} from '@adapters/primary/view-models/carts/cart-content/cartContentVM'
import { getPermissionsVM } from '@adapters/primary/view-models/permissions/getPermissionsVM'
import {
  type CartAction,
  type CartDetail,
  type CartListCustomer,
  CartListStatus,
  CartMissingInformation
} from '@core/entities/cart'
import type { Address, Contact } from '@core/entities/order'
import { useCartDetailStore } from '@store/cartDetailStore'

export interface CartDetailStatusVM {
  labelKey: string
  color: string
}

export interface CartReadinessVM {
  labelKey: string
  done: boolean
}

export interface CartDetailContentVM extends CartContentVM {
  titleKey: string
  titleParams: Record<string, string>
  customerLink?: string
  contact?: Contact
  isAnonymous: boolean
  status?: CartDetailStatusVM
  deliveryAddress?: Array<string>
  pickupName?: string
  readiness: Array<CartReadinessVM>
  convertLink?: string
  orderLink?: string
  cartLink?: string
  customerUuid?: string
  canEditCodes: boolean
  isUpdating: boolean
  pendingAction?: CartAction
}

export interface GetCartDetailVM {
  isLoading: boolean
  cart?: CartDetailContentVM
}

const STATUS_COLORS: Record<CartListStatus, string> = {
  [CartListStatus.Open]: 'green',
  [CartListStatus.Abandoned]: 'amber',
  [CartListStatus.Closed]: 'gray'
}

const ORDER_STEPS: Array<CartMissingInformation> = [
  CartMissingInformation.DeliveryMethod,
  CartMissingInformation.Contact,
  CartMissingInformation.Addresses
]

const customerNameOf = (customer: CartListCustomer): string =>
  [customer.firstname, customer.lastname].filter(Boolean).join(' ') ||
  customer.email

const titleOf = (
  cart: CartDetail
): Pick<CartDetailContentVM, 'titleKey' | 'titleParams'> =>
  cart.customer
    ? {
        titleKey: 'carts.detail.customerTitle',
        titleParams: { name: customerNameOf(cart.customer) }
      }
    : { titleKey: 'carts.detail.guestTitle', titleParams: {} }

const statusOf = (status: CartListStatus): CartDetailStatusVM => ({
  labelKey: `carts.status.${status}`,
  color: STATUS_COLORS[status]
})

const addressLines = (address: Address): Array<string> =>
  [
    `${address.firstname} ${address.lastname}`.trim(),
    address.appartement,
    address.address,
    `${address.zip} ${address.city}`.trim(),
    address.country
  ].filter((line): line is string => !!line)

const readinessStep = (
  missing: Array<CartMissingInformation>,
  step: CartMissingInformation
): CartReadinessVM => ({
  labelKey: `carts.detail.readiness.${step}`,
  done: !missing.includes(step)
})

const readinessOf = (cart: CartDetail): Array<CartReadinessVM> => {
  if (cart.orderUuid) {
    return []
  }
  const blockers = cart.missingForOrder.filter(
    (missing) =>
      !ORDER_STEPS.includes(missing) && missing !== CartMissingInformation.Lines
  )
  return [...ORDER_STEPS, ...blockers].map((step) =>
    readinessStep(cart.missingForOrder, step)
  )
}

const isReachable = (cart: CartDetail): boolean =>
  !!cart.customerUuid || !!cart.contact

const convertLinkOf = (cart: CartDetail): string | undefined => {
  const canConvert =
    !!cart.uuid &&
    cart.lines.length > 0 &&
    !cart.orderUuid &&
    isReachable(cart) &&
    getPermissionsVM().canAccessOrders
  return canConvert ? `/orders/new?cart=${cart.uuid}` : undefined
}

const canEditCodes = (cart: CartDetail, pendingAction?: CartAction): boolean =>
  !!cart.customerUuid &&
  cart.lines.length > 0 &&
  !cart.orderUuid &&
  pendingAction === undefined

const cartDetailContentVM = (
  cart: CartDetail,
  pendingAction?: CartAction
): CartDetailContentVM => {
  const convertLink = convertLinkOf(cart)
  return {
    ...cartContentVM(cart),
    ...titleOf(cart),
    ...(cart.customerUuid && {
      customerLink: `/customers/get/${cart.customerUuid}`
    }),
    ...(cart.contact && { contact: cart.contact }),
    isAnonymous: !isReachable(cart),
    ...(cart.status && { status: statusOf(cart.status) }),
    ...(cart.deliveryAddress && {
      deliveryAddress: addressLines(cart.deliveryAddress)
    }),
    ...(cart.delivery?.pickupName && { pickupName: cart.delivery.pickupName }),
    readiness: readinessOf(cart),
    ...(convertLink && { convertLink }),
    ...(cart.orderUuid && { orderLink: `/orders/${cart.orderUuid}` }),
    ...(cart.uuid && { cartLink: `/customers/carts/${cart.uuid}` }),
    ...(cart.customerUuid && { customerUuid: cart.customerUuid }),
    canEditCodes: canEditCodes(cart, pendingAction),
    isUpdating: pendingAction !== undefined,
    ...(pendingAction && { pendingAction })
  }
}

export const getCartDetailVM = (): GetCartDetailVM => {
  const cartDetailStore = useCartDetailStore()
  return {
    isLoading: cartDetailStore.isLoading,
    ...(cartDetailStore.current && {
      cart: cartDetailContentVM(
        cartDetailStore.current,
        cartDetailStore.pendingAction
      )
    })
  }
}
