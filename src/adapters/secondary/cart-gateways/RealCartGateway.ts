import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import type {
  Cart,
  CartDetail,
  CartListFilters,
  CartListItem,
  CartListPagination,
  CartListStatus
} from '@core/entities/cart'
import { CartDoesNotExistsError } from '@core/errors/CartDoesNotExistsError'
import { CartGateway } from '@core/gateways/cartGateway'
import { UUID } from '@core/types/types'
import { isAxiosError } from 'axios'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealCartGateway extends RealGateway implements CartGateway {
  constructor(url: string) {
    super(url)
  }

  async list(
    status: CartListStatus | undefined,
    filters: CartListFilters,
    { limit, offset }: CartListPagination
  ): Promise<Array<CartListItem>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/carts`, {
      params: { status, ...filters, limit, offset }
    })
    return res.data
  }

  async getByUuid(uuid: UUID): Promise<CartDetail> {
    try {
      const res = await axiosWithBearer.get(`${this.baseUrl}/carts/${uuid}`)
      return res.data
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new CartDoesNotExistsError(uuid)
      }
      throw error
    }
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
