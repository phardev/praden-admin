import { Address, CollectionPlace } from '@core/entities/order'
import type { Timestamp } from '@core/types/types'
import { priceFormatter } from '@utils/formatters'
import { addTaxToPrice } from '@utils/price'
import type { DeliveryMethodChoiceVM } from './deliveryMethodChoicesVM'
import { requiresPickupPoint } from './deliveryMethodChoicesVM'
import type {
  OrderCreateFormLine,
  OrderCreateFormState
} from './orderCreateFormState'
import {
  promotionalUnitPriceWithTax,
  selectApplicablePromotion
} from './productPromotionPricing'
import { isPromotionCodeDiscountCurrent } from './promotionCodeBasis'

export interface OrderCreateSummaryVM {
  linesCount: number
  formattedLinesTotal: string
  formattedDeliveryFee?: string
  formattedPromotionCodeDiscount?: string
  promotionCodeNoteKey?: string
  formattedTotal: string
  blockers: Array<string>
  canSubmit: boolean
}

const DELIVERY_TAX_RATE = 20
const EMAIL_FORMAT = /.+@.+\..+/

const isAddressComplete = (address: Address): boolean => {
  return (
    address.firstname !== '' &&
    address.lastname !== '' &&
    address.address !== '' &&
    address.city !== '' &&
    address.zip !== '' &&
    address.country !== ''
  )
}

const areAddressesComplete = (formState: OrderCreateFormState): boolean => {
  const isClickAndCollect =
    formState.deliveryMethod?.collectionPlace ===
    CollectionPlace.PharmacyCounter
  if (isClickAndCollect) {
    return isAddressComplete(formState.billingAddress)
  }
  if (!isAddressComplete(formState.deliveryAddress)) {
    return false
  }
  return (
    formState.billingSameAsDelivery ||
    isAddressComplete(formState.billingAddress)
  )
}

const isContactComplete = (formState: OrderCreateFormState): boolean => {
  return (
    EMAIL_FORMAT.test(formState.contact.email) && formState.contact.phone !== ''
  )
}

const hasMaxQuantityError = (formState: OrderCreateFormState): boolean => {
  return formState.lines.some(({ product, quantity }) => {
    return (
      product.maxQuantityForOrder !== undefined &&
      quantity > product.maxQuantityForOrder
    )
  })
}

const isSelectedDeliveryMethodUnavailable = (
  formState: OrderCreateFormState,
  selectedChoice?: DeliveryMethodChoiceVM
): boolean => {
  if (!formState.deliveryMethod) {
    return false
  }
  return (
    !selectedChoice ||
    selectedChoice.disabled ||
    selectedChoice.fee === undefined
  )
}

const isRelayPointMissing = (formState: OrderCreateFormState): boolean => {
  return (
    formState.deliveryMethod !== undefined &&
    requiresPickupPoint(formState.deliveryMethod) &&
    formState.selectedRelayPoint === undefined
  )
}

const isPickingSlotMissing = (formState: OrderCreateFormState): boolean => {
  return (
    formState.deliveryMethod?.collectionPlace ===
      CollectionPlace.PharmacyCounter &&
    (formState.pickingDate === undefined || formState.pickingHour === undefined)
  )
}

const computeBlockers = (
  formState: OrderCreateFormState,
  selectedChoice?: DeliveryMethodChoiceVM
): Array<string> => {
  const blockers: Array<string> = []
  if (!formState.customer) {
    blockers.push('orders.create.blockers.selectCustomer')
  }
  if (formState.lines.length === 0) {
    blockers.push('orders.create.blockers.addProducts')
  }
  if (hasMaxQuantityError(formState)) {
    blockers.push('orders.create.blockers.fixQuantities')
  }
  if (!formState.deliveryMethod) {
    blockers.push('orders.create.blockers.selectDeliveryMethod')
  }
  if (isSelectedDeliveryMethodUnavailable(formState, selectedChoice)) {
    blockers.push('orders.create.blockers.deliveryMethodUnavailable')
  }
  if (isRelayPointMissing(formState)) {
    blockers.push('orders.create.blockers.selectRelayPoint')
  }
  if (isPickingSlotMissing(formState)) {
    blockers.push('orders.create.blockers.selectPickingSlot')
  }
  if (!areAddressesComplete(formState)) {
    blockers.push('orders.create.blockers.fillAddresses')
  }
  if (!isContactComplete(formState)) {
    blockers.push('orders.create.blockers.fillContact')
  }
  return blockers
}

const getLineUnitPriceWithTax = (
  line: OrderCreateFormLine,
  now: Timestamp
): number => {
  return promotionalUnitPriceWithTax(
    line.product,
    selectApplicablePromotion(line.promotions, now)
  )
}

export const orderCreateSummaryVM = (
  formState: OrderCreateFormState,
  selectedChoice: DeliveryMethodChoiceVM | undefined,
  now: Timestamp,
  voucherDiscount = 0
): OrderCreateSummaryVM => {
  const formatter = priceFormatter('fr-FR', 'EUR')
  const linesTotal = formState.lines.reduce((acc, line) => {
    return acc + getLineUnitPriceWithTax(line, now) * line.quantity
  }, 0)
  const deliveryFee = selectedChoice?.fee
  const deliveryFeeWithTax =
    deliveryFee !== undefined
      ? Math.round(addTaxToPrice(deliveryFee, DELIVERY_TAX_RATE))
      : undefined
  const blockers = computeBlockers(formState, selectedChoice)
  const promotionCodeDiscount = isPromotionCodeDiscountCurrent(formState)
    ? formState.promotionCode!.discount
    : 0
  return {
    linesCount: formState.lines.reduce((acc, { quantity }) => {
      return acc + quantity
    }, 0),
    formattedLinesTotal: formatter.format(linesTotal / 100),
    formattedDeliveryFee:
      deliveryFeeWithTax !== undefined
        ? formatter.format(deliveryFeeWithTax / 100)
        : undefined,
    ...(promotionCodeDiscount > 0 && {
      formattedPromotionCodeDiscount: formatter.format(
        promotionCodeDiscount / 100
      )
    }),
    ...(formState.promotionCode &&
      !isPromotionCodeDiscountCurrent(formState) && {
        promotionCodeNoteKey: 'orders.create.promotionCode.recalculated'
      }),
    formattedTotal: formatter.format(
      Math.max(
        0,
        linesTotal +
          (deliveryFeeWithTax ?? 0) -
          voucherDiscount -
          promotionCodeDiscount
      ) / 100
    ),
    blockers,
    canSubmit: blockers.length === 0
  }
}
