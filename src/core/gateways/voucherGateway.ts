import {
  CreateVoucherDTO,
  Voucher,
  VoucherPagination,
  VoucherStatus
} from '@core/entities/voucher'
import { UUID } from '@core/types/types'
import { ApplyVoucherDTO } from '@core/usecases/vouchers/voucher-application/applyVoucher'
import { EditVoucherDTO } from '@core/usecases/vouchers/voucher-edition/editVoucher'

export interface VoucherGateway {
  list(
    status: VoucherStatus,
    pagination: VoucherPagination
  ): Promise<Array<Voucher>>
  getByUuid(uuid: UUID): Promise<Voucher>
  create(dto: CreateVoucherDTO): Promise<Voucher>
  edit(uuid: UUID, dto: EditVoucherDTO): Promise<Voucher>
  delete(uuid: UUID): Promise<void>
  suggestCode(): Promise<string>
  apply(dto: ApplyVoucherDTO): Promise<number>
}
