import { CarrierType } from '@core/entities/carrier'
import type { DeliveryPriceRule } from '@core/entities/deliveryPriceRule'
import { DeliveryMethod, DeliveryType } from '@core/entities/order'
import type { Timestamp } from '@core/types/types'
import { priceFormatter } from '@utils/formatters'
import { addTaxToPrice } from '@utils/price'
import type { OrderCreateFormLine } from './orderCreateFormState'
import { getUnitPriceWithTax } from './orderCreateLinesVM'

export interface DeliveryMethodChoiceVM {
  uuid: string
  name: string
  description: string
  delay?: string
  isClickAndCollect: boolean
  fee?: number
  formattedFee?: string
  isFree: boolean
  disabled: boolean
  disabledReason?: string
}

const MEDICINE_EAN13_PREFIX = '34009'
const DELIVERY_TAX_RATE = 20

interface DeliveryPricingPreviewContext {
  totalOrderValue: number
  totalWeight: number
  hasMedicine: boolean
  country: string
  now: Timestamp
}

const buildPricingContext = (
  lines: Array<OrderCreateFormLine>,
  country: string,
  now: Timestamp
): DeliveryPricingPreviewContext => {
  return {
    totalOrderValue: lines.reduce((acc, { product, quantity }) => {
      return acc + getUnitPriceWithTax(product) * quantity
    }, 0),
    totalWeight: lines.reduce((acc, { product, quantity }) => {
      return acc + product.weight * quantity
    }, 0),
    hasMedicine: lines.some(({ product }) =>
      product.ean13.startsWith(MEDICINE_EAN13_PREFIX)
    ),
    country,
    now
  }
}

const isRelayMethod = (method: DeliveryMethod): boolean => {
  return /relai/i.test(method.name)
}

const RELAY_CARRIERS_WITH_PICKUP_SELECTION = [
  CarrierType.DPD,
  CarrierType.Colissimo
]

const supportsPickupSelection = (method: DeliveryMethod): boolean => {
  return RELAY_CARRIERS_WITH_PICKUP_SELECTION.includes(method.carrier.type)
}

export const requiresPickupPoint = (method: DeliveryMethod): boolean => {
  return isRelayMethod(method) && supportsPickupSelection(method)
}

const computeConfigurablePrice = (
  method: DeliveryMethod,
  rules: Array<DeliveryPriceRule>,
  context: DeliveryPricingPreviewContext
): number => {
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority)
  for (const rule of sortedRules) {
    if (
      rule.deliveryMethodUuid === method.uuid &&
      rule.isActive &&
      context.totalOrderValue >= rule.minOrderValue &&
      context.totalWeight < rule.maxWeight &&
      (!rule.startDate || context.now >= rule.startDate) &&
      (!rule.endDate || context.now < rule.endDate) &&
      !context.hasMedicine
    ) {
      return rule.price
    }
  }
  return -1
}

const computeDefaultPrice = (
  method: DeliveryMethod,
  context: DeliveryPricingPreviewContext
): number | undefined => {
  const priceRangesForCountry =
    method.priceRanges[context.country.toUpperCase()]
  if (!priceRangesForCountry) {
    if (method.type === DeliveryType.ClickAndCollect) {
      return 0
    }
    return undefined
  }
  const sortedRanges = [...priceRangesForCountry].sort(
    (a, b) => a.minWeight - b.minWeight
  )
  for (const range of sortedRanges) {
    if (
      context.totalWeight >= range.minWeight &&
      context.totalWeight <= range.maxWeight
    ) {
      return range.price
    }
  }
  return sortedRanges[sortedRanges.length - 1].price
}

const computeFee = (
  method: DeliveryMethod,
  rules: Array<DeliveryPriceRule>,
  context: DeliveryPricingPreviewContext
): number | undefined => {
  const configurablePrice = computeConfigurablePrice(method, rules, context)
  if (configurablePrice >= 0) {
    return configurablePrice
  }
  return computeDefaultPrice(method, context)
}

const disabledChoice = (
  method: DeliveryMethod,
  disabledReason: string
): DeliveryMethodChoiceVM => {
  return {
    uuid: method.uuid,
    name: method.name,
    description: method.description,
    delay: method.delay,
    isClickAndCollect: method.type === DeliveryType.ClickAndCollect,
    fee: undefined,
    formattedFee: undefined,
    isFree: false,
    disabled: true,
    disabledReason
  }
}

export const deliveryMethodChoicesVM = (
  methods: Array<DeliveryMethod>,
  rules: Array<DeliveryPriceRule>,
  lines: Array<OrderCreateFormLine>,
  country: string,
  now: Timestamp
): Array<DeliveryMethodChoiceVM> => {
  const formatter = priceFormatter('fr-FR', 'EUR')
  const context = buildPricingContext(lines, country, now)
  return methods.map((method) => {
    if (isRelayMethod(method) && !supportsPickupSelection(method)) {
      return disabledChoice(method, 'orders.create.delivery.relayNotAvailable')
    }
    if (lines.length === 0) {
      return disabledChoice(method, 'orders.create.delivery.addProductsFirst')
    }
    const fee = computeFee(method, rules, context)
    if (fee === undefined) {
      return disabledChoice(
        method,
        'orders.create.delivery.notAvailableForCountry'
      )
    }
    const feeWithTax = Math.round(addTaxToPrice(fee, DELIVERY_TAX_RATE))
    return {
      uuid: method.uuid,
      name: method.name,
      description: method.description,
      delay: method.delay,
      isClickAndCollect: method.type === DeliveryType.ClickAndCollect,
      fee,
      formattedFee: formatter.format(feeWithTax / 100),
      isFree: feeWithTax === 0,
      disabled: false,
      disabledReason: undefined
    }
  })
}
