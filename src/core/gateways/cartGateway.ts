import type {
  Cart,
  CartDetail,
  CartListFilters,
  CartListItem,
  CartListPagination,
  CartListStatus
} from '@core/entities/cart'
import { UUID } from '@core/types/types'

export interface CartGateway {
  list(
    status: CartListStatus | undefined,
    filters: CartListFilters,
    pagination: CartListPagination
  ): Promise<Array<CartListItem>>
  getByUuid(uuid: UUID): Promise<CartDetail>
  applyPromotionCode(customerUuid: UUID, code: string): Promise<Cart>
  removePromotionCode(customerUuid: UUID): Promise<Cart>
  applyVoucher(customerUuid: UUID, code: string): Promise<Cart>
  removeVoucher(customerUuid: UUID): Promise<Cart>
}
