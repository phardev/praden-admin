import {
  VoucherCannotBeAppliedReason,
  VoucherError,
  VoucherErrorCode
} from './VoucherError'

export class VoucherCannotBeAppliedError extends VoucherError {
  constructor(code: string, reason: VoucherCannotBeAppliedReason) {
    super(
      VoucherErrorCode.CannotBeApplied,
      `Voucher cannot be applied: ${code} (${reason})`,
      reason
    )
    this.name = 'VoucherCannotBeAppliedError'
  }
}
