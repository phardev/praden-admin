import { type CartListFilters, CartListTab } from '@core/entities/cart'
import { filterCarts } from '@core/usecases/carts/cart-listing/filterCarts'
import { useCartListStore } from '@store/cartListStore'
import {
  elodieClosedCartItem,
  elodieOpenCartItem,
  lucasAbandonedCartItem
} from '@utils/testData/carts'
import { createPinia, setActivePinia } from 'pinia'

describe('Filter carts', () => {
  let cartListStore: ReturnType<typeof useCartListStore>
  const filters: CartListFilters = {
    customerQuery: lucasAbandonedCartItem.customer!.lastname,
    startDate: lucasAbandonedCartItem.lastActivityAt,
    endDate: elodieOpenCartItem.lastActivityAt
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    cartListStore = useCartListStore()
    cartListStore.list(CartListTab.All, [elodieOpenCartItem])
    cartListStore.list(CartListTab.Closed, [elodieClosedCartItem])
    cartListStore.setHasMore(CartListTab.All, true)
    filterCarts(filters)
  })

  it('should remember the filters', () => {
    expect(cartListStore.filters).toStrictEqual(filters)
  })

  it('should forget the carts listed with the previous filters', () => {
    expect(cartListStore.items).toStrictEqual({
      [CartListTab.All]: [],
      [CartListTab.Open]: [],
      [CartListTab.Abandoned]: [],
      [CartListTab.Closed]: []
    })
  })

  it('should not expect more carts before listing again', () => {
    expect(cartListStore.hasMore[CartListTab.All]).toStrictEqual(false)
  })
})
