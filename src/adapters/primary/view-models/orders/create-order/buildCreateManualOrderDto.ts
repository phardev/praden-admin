import { Address, DeliveryType } from '@core/entities/order'
import type { CreateManualOrderDTO } from '@core/usecases/order/manual-order-creation/createManualOrder'
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
  formState: OrderCreateFormState
): CreateManualOrderDTO => {
  const isClickAndCollect =
    formState.deliveryMethod?.type === DeliveryType.ClickAndCollect
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
  }
  return dto
}
