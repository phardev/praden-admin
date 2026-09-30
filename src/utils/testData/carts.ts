import {
  type Cart,
  CartCodeStatus,
  CartEventType,
  CartLineAlert,
  type CartListItem,
  CartListStatus,
  CartMissingInformation
} from '@core/entities/cart'
import { ReductionType } from '@core/entities/promotion'
import { elodieDurand, lucasLefevre } from './customers'
import { deliveryInRelayPointDPD } from './deliveryMethods'
import { chamomilla, dolodent } from './products'

const cartUpdate = 1790000000000

const elodieAddress = {
  firstname: elodieDurand.firstname,
  lastname: elodieDurand.lastname,
  address: '12 rue des Lilas',
  city: 'Lyon',
  zip: '69003',
  country: 'France'
}

export const elodieCart: Cart = {
  uuid: 'elodie-cart',
  customerUuid: elodieDurand.uuid,
  lines: [
    {
      productUuid: dolodent.uuid,
      name: dolodent.name,
      ean13: dolodent.ean13,
      isMedicine: true,
      quantity: 2,
      maxQuantity: 5,
      unitPriceWithTax: 550,
      unitPriceWithTaxBeforePromotion: 550,
      totalWithTax: 1100,
      alerts: []
    },
    {
      productUuid: chamomilla.uuid,
      name: chamomilla.name,
      ean13: chamomilla.ean13,
      isMedicine: false,
      quantity: 1,
      maxQuantity: 0,
      unitPriceWithTax: 900,
      unitPriceWithTaxBeforePromotion: 1000,
      promotion: {
        uuid: 'promotion-chamomilla',
        type: ReductionType.Fixed,
        amount: 100
      },
      totalWithTax: 900,
      alerts: [CartLineAlert.OutOfStock]
    }
  ],
  totalQuantity: 3,
  containsMedicine: true,
  totals: {
    productsWithTax: 2000,
    deliveryWithTax: null,
    promotionCodeDiscount: 0,
    voucherDiscount: 0,
    total: 2000
  },
  missingForOrder: [
    CartMissingInformation.DeliveryMethod,
    CartMissingInformation.Contact,
    CartMissingInformation.Addresses,
    CartMissingInformation.BlockingAlerts
  ],
  updatedAt: cartUpdate,
  activity: [
    {
      type: CartEventType.ProductAdded,
      data: { productUuid: dolodent.uuid, quantity: 2 },
      createdAt: cartUpdate,
      createdBy: elodieDurand.uuid
    }
  ]
}

export const elodieCartReadyToOrder: Cart = {
  ...elodieCart,
  uuid: 'elodie-ready-cart',
  lines: [elodieCart.lines[0]],
  totalQuantity: 2,
  delivery: {
    methodUuid: deliveryInRelayPointDPD.uuid,
    pickupId: 'dpd-pudo-123',
    pickupName: 'Tabac Le Marigny'
  },
  contact: { email: elodieDurand.email, phone: elodieDurand.phone },
  deliveryAddress: {
    ...elodieAddress,
    address: '3 place du Marché',
    zip: '69002'
  },
  billingAddress: elodieAddress,
  customerMessage: 'Merci de bien emballer',
  promotionCode: {
    code: 'BIENVENUE',
    status: CartCodeStatus.Rejected,
    discount: 0,
    rejection: {
      reason: 'MINIMUM_AMOUNT_NOT_REACHED',
      minimumAmount: 3000,
      missingAmount: 1900
    }
  },
  voucher: { code: 'BON-10', status: CartCodeStatus.Applied, discount: 1000 },
  totals: {
    productsWithTax: 1100,
    deliveryWithTax: 490,
    promotionCodeDiscount: 0,
    voucherDiscount: 1000,
    total: 590
  },
  missingForOrder: []
}

export const lucasEmptyCart: Cart = {
  customerUuid: lucasLefevre.uuid,
  lines: [],
  totalQuantity: 0,
  containsMedicine: false,
  totals: {
    productsWithTax: 0,
    deliveryWithTax: null,
    promotionCodeDiscount: 0,
    voucherDiscount: 0,
    total: 0
  },
  missingForOrder: [
    CartMissingInformation.Lines,
    CartMissingInformation.DeliveryMethod,
    CartMissingInformation.Contact,
    CartMissingInformation.Addresses
  ],
  updatedAt: cartUpdate,
  activity: []
}

export const elodieOpenCartItem: CartListItem = {
  uuid: elodieCart.uuid!,
  customer: {
    uuid: elodieDurand.uuid,
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    email: elodieDurand.email
  },
  totalWithTax: elodieCart.totals.total,
  totalQuantity: elodieCart.totalQuantity,
  lastActivityAt: cartUpdate,
  status: CartListStatus.Open,
  lastRejectedCode: 'BIENVENUE',
  evaluatedAt: cartUpdate
}

export const guestOpenCartItem: CartListItem = {
  uuid: 'guest-cart',
  totalQuantity: 1,
  lastActivityAt: cartUpdate - 1000,
  status: CartListStatus.Open
}

export const lucasAbandonedCartItem: CartListItem = {
  uuid: 'lucas-cart',
  customer: {
    uuid: lucasLefevre.uuid,
    firstname: lucasLefevre.firstname,
    lastname: lucasLefevre.lastname,
    email: lucasLefevre.email
  },
  totalWithTax: 3200,
  totalQuantity: 2,
  lastActivityAt: cartUpdate - 2 * 24 * 60 * 60 * 1000,
  status: CartListStatus.Abandoned,
  evaluatedAt: cartUpdate - 2 * 24 * 60 * 60 * 1000
}

export const elodieClosedCartItem: CartListItem = {
  uuid: 'elodie-closed-cart',
  customer: elodieOpenCartItem.customer,
  totalWithTax: 1500,
  totalQuantity: 1,
  lastActivityAt: cartUpdate - 5 * 24 * 60 * 60 * 1000,
  status: CartListStatus.Closed,
  orderUuid: 'elodie-paid-order',
  evaluatedAt: cartUpdate - 5 * 24 * 60 * 60 * 1000
}
