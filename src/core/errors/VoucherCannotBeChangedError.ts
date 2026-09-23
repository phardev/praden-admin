import { VoucherError, VoucherErrorCode } from './VoucherError'

export class VoucherCannotBeChangedError extends VoucherError {
  constructor(uuid: string, code: VoucherErrorCode) {
    super(code, `Voucher cannot be changed: ${uuid}`)
    this.name = 'VoucherCannotBeChangedError'
  }
}
