import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { removePromotionCodeFromCustomerCart } from '@core/usecases/carts/promotion-code-removal/removePromotionCodeFromCustomerCart'
import { useCartDetailStore } from '@store/cartDetailStore'
import { elodieCartReadyToOrder } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Remove promotion code from customer cart', () => {
  it('should show the cart without its code', async () => {
    setActivePinia(createPinia())
    const cartDetailStore = useCartDetailStore()
    const cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithCustomerCarts(elodieCartReadyToOrder)
    cartDetailStore.setCurrent(elodieCartReadyToOrder)
    await removePromotionCodeFromCustomerCart(elodieDurand.uuid, cartGateway)
    const { promotionCode: _removed, ...expected } = elodieCartReadyToOrder
    expect(cartDetailStore.current).toStrictEqual(expected)
  })
})
