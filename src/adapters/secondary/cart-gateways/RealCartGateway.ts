import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import type {
  Cart,
  CartListItem,
  CartListPagination,
  CartListStatus
} from '@core/entities/cart'
import { CartGateway } from '@core/gateways/cartGateway'
import { UUID } from '@core/types/types'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealCartGateway extends RealGateway implements CartGateway {
  constructor(url: string) {
    super(url)
  }

  async list(
    status: CartListStatus | undefined,
    { limit, offset }: CartListPagination
  ): Promise<Array<CartListItem>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/carts`, {
      params: { status, limit, offset }
    })
    return res.data
  }

  async applyPromotionCode(customerUuid: UUID, code: string): Promise<Cart> {
    const res = await axiosWithBearer.put(
      this.customerCartUrl(customerUuid, 'promotion-code'),
      { code }
    )
    return res.data
  }

  async removePromotionCode(customerUuid: UUID): Promise<Cart> {
    const res = await axiosWithBearer.delete(
      this.customerCartUrl(customerUuid, 'promotion-code')
    )
    return res.data
  }

  async applyVoucher(customerUuid: UUID, code: string): Promise<Cart> {
    const res = await axiosWithBearer.put(
      this.customerCartUrl(customerUuid, 'voucher'),
      { code }
    )
    return res.data
  }

  async removeVoucher(customerUuid: UUID): Promise<Cart> {
    const res = await axiosWithBearer.delete(
      this.customerCartUrl(customerUuid, 'voucher')
    )
    return res.data
  }

  private customerCartUrl(customerUuid: UUID, code: string): string {
    return `${this.baseUrl}/customers/${customerUuid}/cart/${code}`
  }
}
