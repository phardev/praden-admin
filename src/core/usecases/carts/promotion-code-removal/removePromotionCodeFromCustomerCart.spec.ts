import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { removePromotionCodeFromCustomerCart } from '@core/usecases/carts/promotion-code-removal/removePromotionCodeFromCustomerCart'
import { useCustomerStore } from '@store/customerStore'
import { elodieCartReadyToOrder } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Remove promotion code from customer cart', () => {
  it('should show the cart without its code', async () => {
    setActivePinia(createPinia())
    const customerStore = useCustomerStore()
    const cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithCustomerCarts(elodieCartReadyToOrder)
    customerStore.setCurrent({
      ...elodieDurand,
      currentCart: elodieCartReadyToOrder
    })
    await removePromotionCodeFromCustomerCart(elodieDurand.uuid, cartGateway)
    const { promotionCode: _removed, ...expected } = elodieCartReadyToOrder
    expect(customerStore.current?.currentCart).toStrictEqual(expected)
  })
})
