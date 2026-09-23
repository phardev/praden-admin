import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import {
  CreateVoucherDTO,
  Voucher,
  VoucherPagination,
  VoucherStatus
} from '@core/entities/voucher'
import { VoucherGateway } from '@core/gateways/voucherGateway'
import { UUID } from '@core/types/types'
import { ApplyVoucherDTO } from '@core/usecases/vouchers/voucher-application/applyVoucher'
import { EditVoucherDTO } from '@core/usecases/vouchers/voucher-edition/editVoucher'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealVoucherGateway extends RealGateway implements VoucherGateway {
  constructor(url: string) {
    super(url)
  }

  async list(
    status: VoucherStatus,
    pagination: VoucherPagination
  ): Promise<Array<Voucher>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/vouchers`, {
      params: { status, limit: pagination.limit, offset: pagination.offset }
    })
    return Promise.resolve(res.data)
  }

  async getByUuid(uuid: UUID): Promise<Voucher> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/vouchers/${uuid}`)
    return Promise.resolve(res.data)
  }

  async create(dto: CreateVoucherDTO): Promise<Voucher> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/vouchers`, dto)
    return Promise.resolve(res.data)
  }

  async edit(uuid: UUID, dto: EditVoucherDTO): Promise<Voucher> {
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/vouchers/${uuid}`,
      dto
    )
    return Promise.resolve(res.data)
  }

  async delete(uuid: UUID): Promise<void> {
    await axiosWithBearer.delete(`${this.baseUrl}/vouchers/${uuid}`)
  }

  async suggestCode(): Promise<string> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/vouchers/code-suggestion`
    )
    return Promise.resolve(res.data.code)
  }

  async apply(dto: ApplyVoucherDTO): Promise<number> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/vouchers/apply`,
      dto
    )
    return Promise.resolve(res.data.totalDiscounted)
  }
}
