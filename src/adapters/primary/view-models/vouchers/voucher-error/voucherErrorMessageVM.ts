import {
  VoucherCannotBeAppliedReason,
  VoucherErrorCode
} from '@core/errors/VoucherError'

const GENERIC_ERROR_KEY = 'error.unknown'
const UNKNOWN_REFUSAL_KEY = 'voucher.errors.cannotBeApplied.unknown'

const keysByCode: Record<string, string> = {
  [VoucherErrorCode.NotFound]: 'voucher.errors.notFound',
  [VoucherErrorCode.CodeAlreadyExists]: 'voucher.errors.codeAlreadyExists',
  [VoucherErrorCode.AlreadyUsed]: 'voucher.errors.alreadyUsed',
  [VoucherErrorCode.AttachedToOrder]: 'voucher.errors.attachedToOrder',
  [VoucherErrorCode.InvalidAmount]: 'voucher.errors.invalidAmount',
  [VoucherErrorCode.ExpirationInThePast]: 'voucher.errors.expirationInThePast',
  [VoucherErrorCode.CustomerNotFound]: 'voucher.errors.customerNotFound',
  [VoucherErrorCode.PromotionCodeCannotBeApplied]:
    'voucher.errors.promotionCodeCannotBeApplied'
}

const keysByRefusalReason: Record<string, string> = {
  [VoucherCannotBeAppliedReason.CustomerNotIdentified]:
    'voucher.errors.cannotBeApplied.customerNotIdentified',
  [VoucherCannotBeAppliedReason.BelongsToAnotherCustomer]:
    'voucher.errors.cannotBeApplied.belongsToAnotherCustomer',
  [VoucherCannotBeAppliedReason.AlreadyUsed]:
    'voucher.errors.cannotBeApplied.alreadyUsed',
  [VoucherCannotBeAppliedReason.Expired]:
    'voucher.errors.cannotBeApplied.expired',
  [VoucherCannotBeAppliedReason.InsufficientEligibleAmount]:
    'voucher.errors.cannotBeApplied.insufficientEligibleAmount'
}

interface VoucherErrorBody {
  code?: unknown
  reason?: unknown
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const errorBodyOf = (error: unknown): VoucherErrorBody => {
  if (!isObject(error)) return {}
  const response = error.response
  if (isObject(response)) {
    return isObject(response.data) ? response.data : {}
  }
  return error
}

const refusalKeyOf = (reason: unknown): string =>
  keysByRefusalReason[String(reason)] ?? UNKNOWN_REFUSAL_KEY

export const voucherErrorMessageKey = (error: unknown): string => {
  const { code, reason } = errorBodyOf(error)
  if (code === VoucherErrorCode.CannotBeApplied) {
    return refusalKeyOf(reason)
  }
  return keysByCode[String(code)] ?? GENERIC_ERROR_KEY
}
