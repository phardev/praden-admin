import type { ApplyVoucherDTO } from '@core/usecases/vouchers/voucher-application/applyVoucher'
import type { AppliedVoucher } from '@store/voucherStore'
import { useVoucherStore } from '@store/voucherStore'
import { priceFormatter } from '@utils/formatters'
import { buildCreateManualOrderDto } from './buildCreateManualOrderDto'
import type { OrderCreateFormState } from './orderCreateFormState'

export interface AppliedVoucherVM {
  code: string
  formattedDiscount: string
}

export interface OrderCreateVoucherVM {
  canEditCode: boolean
  canApply: boolean
  isApplying: boolean
  applied?: AppliedVoucherVM
}

const typedCode = (formState: OrderCreateFormState): string =>
  formState.voucherCode.trim()

const isOrderReadyForVoucher = (formState: OrderCreateFormState): boolean =>
  formState.customer !== undefined &&
  formState.lines.length > 0 &&
  formState.deliveryMethod !== undefined

const linesOf = (formState: OrderCreateFormState) =>
  formState.lines.map(({ product, quantity }) => ({
    productUuid: product.uuid,
    quantity
  }))

const isRequestedFor = (
  request: ApplyVoucherDTO,
  formState: OrderCreateFormState
): boolean =>
  request.code === typedCode(formState) &&
  request.customerUuid === formState.customer?.uuid &&
  request.deliveryMethodUuid === formState.deliveryMethod?.uuid &&
  JSON.stringify(request.lines) === JSON.stringify(linesOf(formState))

const toAppliedVoucherVM = (applied: AppliedVoucher): AppliedVoucherVM => {
  const formatter = priceFormatter('fr-FR', 'EUR')
  return {
    code: applied.request.code,
    formattedDiscount: formatter.format(-applied.discount / 100)
  }
}

export const buildApplyVoucherDto = (
  formState: OrderCreateFormState
): ApplyVoucherDTO => {
  const { customerUuid, lines, deliveryAddress, deliveryMethodUuid } =
    buildCreateManualOrderDto(formState)
  return {
    code: typedCode(formState),
    customerUuid,
    lines,
    deliveryAddress,
    deliveryMethodUuid
  }
}

export const currentAppliedVoucher = (
  formState: OrderCreateFormState
): AppliedVoucher | undefined => {
  const applied = useVoucherStore().appliedToManualOrder
  return applied && isRequestedFor(applied.request, formState)
    ? applied
    : undefined
}

export const orderCreateVoucherVM = (
  formState: OrderCreateFormState
): OrderCreateVoucherVM => {
  const voucherStore = useVoucherStore()
  const canEditCode = isOrderReadyForVoucher(formState)
  const applied = currentAppliedVoucher(formState)
  return {
    canEditCode,
    canApply:
      canEditCode && typedCode(formState) !== '' && !voucherStore.isApplying,
    isApplying: voucherStore.isApplying,
    ...(applied && { applied: toAppliedVoucherVM(applied) })
  }
}
