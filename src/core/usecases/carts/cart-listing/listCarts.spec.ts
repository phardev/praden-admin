import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { CartListTab } from '@core/entities/cart'
import { listCarts } from '@core/usecases/carts/cart-listing/listCarts'
import { useCartListStore } from '@store/cartListStore'
import {
  elodieClosedCartItem,
  elodieOpenCartItem,
  guestOpenCartItem,
  lucasAbandonedCartItem
} from '@utils/testData/carts'
import { createPinia, setActivePinia } from 'pinia'

describe('List carts', () => {
  let cartListStore: ReturnType<typeof useCartListStore>
  let cartGateway: InMemoryCartGateway
  const firstPage = { limit: 2, offset: 0 }
  const secondPage = { limit: 2, offset: 2 }

  beforeEach(() => {
    setActivePinia(createPinia())
    cartListStore = useCartListStore()
    cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithListItems(
      elodieOpenCartItem,
      guestOpenCartItem,
      lucasAbandonedCartItem,
      elodieClosedCartItem
    )
  })

  it('should show the first page of every cart', async () => {
    await listCarts(CartListTab.All, firstPage, cartGateway)
    expect(cartListStore.items[CartListTab.All]).toStrictEqual([
      elodieOpenCartItem,
      guestOpenCartItem
    ])
  })

  it('should add the next page after the first one', async () => {
    await listCarts(CartListTab.All, firstPage, cartGateway)
    await listCarts(CartListTab.All, secondPage, cartGateway)
    expect(cartListStore.items[CartListTab.All]).toStrictEqual([
      elodieOpenCartItem,
      guestOpenCartItem,
      lucasAbandonedCartItem,
      elodieClosedCartItem
    ])
  })

  it('should show only the carts of the chosen tab', async () => {
    await listCarts(CartListTab.Abandoned, firstPage, cartGateway)
    expect(cartListStore.items[CartListTab.Abandoned]).toStrictEqual([
      lucasAbandonedCartItem
    ])
  })

  it('should expect more carts after a full page', async () => {
    await listCarts(CartListTab.All, firstPage, cartGateway)
    expect(cartListStore.hasMore[CartListTab.All]).toStrictEqual(true)
  })

  it('should be aware during loading', async () => {
    const unsubscribe = cartListStore.$subscribe((_mutation, state) => {
      expect(state.isLoading).toBe(true)
      unsubscribe()
    })
    await listCarts(CartListTab.All, firstPage, cartGateway)
  })

  it('should be aware that loading is over', async () => {
    await listCarts(CartListTab.All, firstPage, cartGateway)
    expect(cartListStore.isLoading).toBe(false)
  })
})
