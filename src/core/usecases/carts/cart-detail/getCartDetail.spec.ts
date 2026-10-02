import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { CartDoesNotExistsError } from '@core/errors/CartDoesNotExistsError'
import { getCartDetail } from '@core/usecases/carts/cart-detail/getCartDetail'
import { useCartDetailStore } from '@store/cartDetailStore'
import { elodieCartDetail, guestCartDetail } from '@utils/testData/carts'
import { createPinia, setActivePinia } from 'pinia'

describe('Get cart detail', () => {
  let cartDetailStore: ReturnType<typeof useCartDetailStore>
  let cartGateway: InMemoryCartGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    cartDetailStore = useCartDetailStore()
    cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithCartDetails(elodieCartDetail, guestCartDetail)
  })

  it('should show the cart', async () => {
    await getCartDetail(elodieCartDetail.uuid!, cartGateway)
    expect(cartDetailStore.current).toStrictEqual(elodieCartDetail)
  })

  it('should replace the cart shown before', async () => {
    await getCartDetail(elodieCartDetail.uuid!, cartGateway)
    await getCartDetail(guestCartDetail.uuid!, cartGateway)
    expect(cartDetailStore.current).toStrictEqual(guestCartDetail)
  })

  it('should stop loading once the cart is shown', async () => {
    await getCartDetail(elodieCartDetail.uuid!, cartGateway)
    expect(cartDetailStore.isLoading).toStrictEqual(false)
  })

  it('should tell when the cart does not exist', async () => {
    await expect(getCartDetail('unknown-cart', cartGateway)).rejects.toThrow(
      CartDoesNotExistsError
    )
  })

  it('should show nothing when the cart does not exist', async () => {
    await getCartDetail(elodieCartDetail.uuid!, cartGateway)
    await getCartDetail('unknown-cart', cartGateway).catch(() => undefined)
    expect(cartDetailStore.current).toStrictEqual(undefined)
  })

  it('should stop loading when the cart does not exist', async () => {
    await getCartDetail('unknown-cart', cartGateway).catch(() => undefined)
    expect(cartDetailStore.isLoading).toStrictEqual(false)
  })
})
