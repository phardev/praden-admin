export const VoucherErrorCode = {
  NotFound: 'VOUCHER_NOT_FOUND',
  CodeAlreadyExists: 'VOUCHER_CODE_ALREADY_EXISTS',
  AlreadyUsed: 'VOUCHER_ALREADY_USED',
  AttachedToOrder: 'VOUCHER_ATTACHED_TO_ORDER',
  InvalidAmount: 'VOUCHER_INVALID_AMOUNT',
  ExpirationInThePast: 'VOUCHER_EXPIRATION_IN_THE_PAST',
  CustomerNotFound: 'CUSTOMER_NOT_FOUND',
  CannotBeApplied: 'VOUCHER_CANNOT_BE_APPLIED',
  PromotionCodeCannotBeApplied: 'PROMOTION_CODE_CANNOT_BE_APPLIED'
} as const

export type VoucherErrorCode =
  (typeof VoucherErrorCode)[keyof typeof VoucherErrorCode]

export const VoucherCannotBeAppliedReason = {
  CustomerNotIdentified: 'CUSTOMER_NOT_IDENTIFIED',
  BelongsToAnotherCustomer: 'BELONGS_TO_ANOTHER_CUSTOMER',
  AlreadyUsed: 'ALREADY_USED',
  Expired: 'EXPIRED',
  InsufficientEligibleAmount: 'INSUFFICIENT_ELIGIBLE_AMOUNT'
} as const

export type VoucherCannotBeAppliedReason =
  (typeof VoucherCannotBeAppliedReason)[keyof typeof VoucherCannotBeAppliedReason]

export class VoucherError extends Error {
  readonly code: VoucherErrorCode
  readonly reason?: VoucherCannotBeAppliedReason

  constructor(
    code: VoucherErrorCode,
    message: string,
    reason?: VoucherCannotBeAppliedReason
  ) {
    super(message)
    this.name = 'VoucherError'
    this.code = code
    this.reason = reason
  }
}
