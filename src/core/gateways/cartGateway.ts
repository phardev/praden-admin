import type {
  Cart,
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
  applyPromotionCode(customerUuid: UUID, code: string): Promise<Cart>
  removePromotionCode(customerUuid: UUID): Promise<Cart>
  applyVoucher(customerUuid: UUID, code: string): Promise<Cart>
  removeVoucher(customerUuid: UUID): Promise<Cart>
}
