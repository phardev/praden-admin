import { VoucherError, VoucherErrorCode } from './VoucherError'

export class VoucherDoesNotExistsError extends VoucherError {
  constructor(identifier: string) {
    super(
      VoucherErrorCode.NotFound,
      `Voucher does not exists error: ${identifier}`
    )
    this.name = 'VoucherDoesNotExistsError'
  }
}
