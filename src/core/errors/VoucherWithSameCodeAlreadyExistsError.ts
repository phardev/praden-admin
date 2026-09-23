import { VoucherError, VoucherErrorCode } from './VoucherError'

export class VoucherWithSameCodeAlreadyExistsError extends VoucherError {
  constructor(code: string) {
    super(
      VoucherErrorCode.CodeAlreadyExists,
      `Voucher with same code already exists: ${code}`
    )
    this.name = 'VoucherWithSameCodeAlreadyExistsError'
  }
}
