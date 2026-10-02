import type {
  Cart,
  CartDetail,
  CartListItem,
  CartListPagination,
  CartListStatus
} from '@core/entities/cart'
import { UUID } from '@core/types/types'

export interface CartGateway {
  list(
    status: CartListStatus | undefined,
    pagination: CartListPagination
  ): Promise<Array<CartListItem>>
  getByUuid(uuid: UUID): Promise<CartDetail>
  applyPromotionCode(customerUuid: UUID, code: string): Promise<Cart>
  removePromotionCode(customerUuid: UUID): Promise<Cart>
  applyVoucher(customerUuid: UUID, code: string): Promise<Cart>
  removeVoucher(customerUuid: UUID): Promise<Cart>
}
