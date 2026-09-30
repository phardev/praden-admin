import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { removeVoucherFromCustomerCart } from '@core/usecases/carts/voucher-removal/removeVoucherFromCustomerCart'
import { useCustomerStore } from '@store/customerStore'
import { elodieCartReadyToOrder } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Remove voucher from customer cart', () => {
  it('should show the cart without its voucher', async () => {
    setActivePinia(createPinia())
    const customerStore = useCustomerStore()
    const cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithCustomerCarts(elodieCartReadyToOrder)
    customerStore.setCurrent({
      ...elodieDurand,
      currentCart: elodieCartReadyToOrder
    })
    await removeVoucherFromCustomerCart(elodieDurand.uuid, cartGateway)
    const { voucher: _removed, ...expected } = elodieCartReadyToOrder
    expect(customerStore.current?.currentCart).toStrictEqual(expected)
  })
})
