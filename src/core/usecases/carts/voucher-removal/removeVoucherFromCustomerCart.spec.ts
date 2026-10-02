import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { removeVoucherFromCustomerCart } from '@core/usecases/carts/voucher-removal/removeVoucherFromCustomerCart'
import { useCartDetailStore } from '@store/cartDetailStore'
import { elodieCartReadyToOrder } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Remove voucher from customer cart', () => {
  it('should show the cart without its voucher', async () => {
    setActivePinia(createPinia())
    const cartDetailStore = useCartDetailStore()
    const cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithCustomerCarts(elodieCartReadyToOrder)
    cartDetailStore.setCurrent(elodieCartReadyToOrder)
    await removeVoucherFromCustomerCart(elodieDurand.uuid, cartGateway)
    const { voucher: _removed, ...expected } = elodieCartReadyToOrder
    expect(cartDetailStore.current).toStrictEqual(expected)
  })
})
