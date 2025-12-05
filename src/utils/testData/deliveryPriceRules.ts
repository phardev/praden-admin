import type { DeliveryPriceRule } from '@core/entities/deliveryPriceRule'

export const freeShippingOver39: DeliveryPriceRule = {
  uuid: 'rule-free-shipping',
  deliveryMethodUuid: 'delivery-colissimo',
  name: 'Livraison gratuite dès 39€',
  price: 0,
  minOrderValue: 3900,
  maxWeight: 30000,
  priority: 1,
  startDate: null,
  endDate: null,
  isActive: true,
  createdAt: 1701600000000,
  createdBy: 'admin@example.com',
  updatedAt: 1701600000000,
  updatedBy: 'admin@example.com'
}

export const standardShipping: DeliveryPriceRule = {
  uuid: 'rule-standard',
  deliveryMethodUuid: 'delivery-colissimo',
  name: 'Livraison standard',
  price: 590,
  minOrderValue: 0,
  maxWeight: 30000,
  priority: 10,
  startDate: null,
  endDate: null,
  isActive: true,
  createdAt: 1701600000000,
  createdBy: 'admin@example.com',
  updatedAt: 1701600000000,
  updatedBy: 'admin@example.com'
}

export const christmasFreeShipping: DeliveryPriceRule = {
  uuid: 'rule-christmas',
  deliveryMethodUuid: 'delivery-colissimo',
  name: 'Livraison gratuite Noël',
  price: 0,
  minOrderValue: 0,
  maxWeight: 30000,
  priority: 0,
  startDate: 1703116800000,
  endDate: 1703980800000,
  isActive: true,
  createdAt: 1701600000000,
  createdBy: 'admin@example.com',
  updatedAt: 1701600000000,
  updatedBy: 'admin@example.com'
}

export const inactiveRule: DeliveryPriceRule = {
  uuid: 'rule-inactive',
  deliveryMethodUuid: 'delivery-mondial-relay',
  name: 'Ancienne règle désactivée',
  price: 299,
  minOrderValue: 0,
  maxWeight: 10000,
  priority: 5,
  startDate: null,
  endDate: null,
  isActive: false,
  createdAt: 1701600000000,
  createdBy: 'admin@example.com',
  updatedAt: 1701600000000,
  updatedBy: 'admin@example.com'
}

export const deliveryPriceRule1 = freeShippingOver39
export const deliveryPriceRule2 = standardShipping
export const deliveryPriceRule3 = christmasFreeShipping
export const deliveryPriceRule4 = inactiveRule
