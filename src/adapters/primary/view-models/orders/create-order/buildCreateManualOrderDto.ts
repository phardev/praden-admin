import { Address, CollectionPlace } from '@core/entities/order'
import type { CreateManualOrderDTO } from '@core/usecases/order/manual-order-creation/createManualOrder'
import type { AppliedVoucher } from '@store/voucherStore'
import { requiresPickupPoint } from './deliveryMethodChoicesVM'
import type { OrderCreateFormState } from './orderCreateFormState'
import { combinePickingDateAndHour } from './pickingSlotsVM'

const resolveDeliveryAddress = (
  formState: OrderCreateFormState,
  isClickAndCollect: boolean
): Address => {
  return isClickAndCollect
    ? formState.billingAddress
    : formState.deliveryAddress
}

const resolveBillingAddress = (
  formState: OrderCreateFormState,
  isClickAndCollect: boolean
): Address => {
  if (isClickAndCollect || !formState.billingSameAsDelivery) {
    return formState.billingAddress
  }
  return formState.deliveryAddress
}

export const buildCreateManualOrderDto = (
  formState: OrderCreateFormState,
  appliedVoucher?: AppliedVoucher
): CreateManualOrderDTO => {
  const isClickAndCollect =
    formState.deliveryMethod?.collectionPlace ===
    CollectionPlace.PharmacyCounter
  const dto: CreateManualOrderDTO = {
    customerUuid: formState.customer!.uuid,
    lines: formState.lines.map(({ product, quantity }) => {
      return { productUuid: product.uuid, quantity }
    }),
    deliveryMethodUuid: formState.deliveryMethod!.uuid,
    deliveryAddress: {
      ...resolveDeliveryAddress(formState, isClickAndCollect)
    },
    billingAddress: { ...resolveBillingAddress(formState, isClickAndCollect) },
    contact: { ...formState.contact },
    sendConfirmationEmail: formState.sendConfirmationEmail,
    paymentMode: formState.paymentMode
  }
  if (
    isClickAndCollect &&
    formState.pickingDate !== undefined &&
    formState.pickingHour !== undefined
  ) {
    dto.pickingDate = combinePickingDateAndHour(
      formState.pickingDate,
      formState.pickingHour
    )
  }
  if (
    formState.deliveryMethod !== undefined &&
    requiresPickupPoint(formState.deliveryMethod) &&
    formState.selectedRelayPoint !== undefined
  ) {
    dto.pickupId = formState.selectedRelayPoint.id
    dto.pickupName = formState.selectedRelayPoint.name
  }
  if (appliedVoucher !== undefined) {
    dto.voucherCode = appliedVoucher.request.code
  }
  if (formState.promotionCode !== undefined) {
    dto.promotionCode = formState.promotionCode.code
  }
  if (formState.customerMessage !== undefined) {
    dto.customerMessage = formState.customerMessage
  }
  if (formState.cartUuid !== undefined) {
    dto.cartUuid = formState.cartUuid
  }
  return dto
}
