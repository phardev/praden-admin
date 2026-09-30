import {
  type Cart,
  CartCodeStatus,
  type CartListItem,
  type CartListPagination,
  type CartListStatus
} from '@core/entities/cart'
import { CartGateway } from '@core/gateways/cartGateway'
import { UUID } from '@core/types/types'

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export class InMemoryCartGateway implements CartGateway {
  private customerCarts: Array<Cart> = []
  private listItems: Array<CartListItem> = []

  list(
    status: CartListStatus | undefined,
    { limit, offset }: CartListPagination
  ): Promise<Array<CartListItem>> {
    const items = this.listItems
      .filter((item) => !status || item.status === status)
      .slice(offset, offset + limit)
    return Promise.resolve(copy(items))
  }

  applyPromotionCode(customerUuid: UUID, code: string): Promise<Cart> {
    return this.change(customerUuid, (cart) => ({
      ...cart,
      promotionCode: { code, status: CartCodeStatus.Applied, discount: 0 }
    }))
  }

  removePromotionCode(customerUuid: UUID): Promise<Cart> {
    return this.change(
      customerUuid,
      ({ promotionCode: _removed, ...cart }) => cart
    )
  }

  applyVoucher(customerUuid: UUID, code: string): Promise<Cart> {
    return this.change(customerUuid, (cart) => ({
      ...cart,
      voucher: { code, status: CartCodeStatus.Applied, discount: 0 }
    }))
  }

  removeVoucher(customerUuid: UUID): Promise<Cart> {
    return this.change(customerUuid, ({ voucher: _removed, ...cart }) => cart)
  }

  feedWithCustomerCarts(...carts: Array<Cart>) {
    this.customerCarts = copy(carts)
  }

  feedWithListItems(...items: Array<CartListItem>) {
    this.listItems = copy(items)
  }

  private change(
    customerUuid: UUID,
    apply: (cart: Cart) => Cart
  ): Promise<Cart> {
    const cart = this.customerCarts.find((c) => c.customerUuid === customerUuid)
    if (!cart) {
      throw new Error(`No cart for customer ${customerUuid}`)
    }
    const changed = apply(cart)
    this.customerCarts = this.customerCarts.map((c) =>
      c.customerUuid === customerUuid ? changed : c
    )
    return Promise.resolve(copy(changed))
  }
}
