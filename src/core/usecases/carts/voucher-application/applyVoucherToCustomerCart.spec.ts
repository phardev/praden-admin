import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { CartCodeStatus } from '@core/entities/cart'
import { applyVoucherToCustomerCart } from '@core/usecases/carts/voucher-application/applyVoucherToCustomerCart'
import { useCustomerStore } from '@store/customerStore'
import { elodieCart } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Apply voucher to customer cart', () => {
  it('should show the cart answered for the voucher', async () => {
    setActivePinia(createPinia())
    const customerStore = useCustomerStore()
    const cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithCustomerCarts(elodieCart)
    customerStore.setCurrent({ ...elodieDurand, currentCart: elodieCart })
    await applyVoucherToCustomerCart(elodieDurand.uuid, 'BON-10', cartGateway)
    expect(customerStore.current?.currentCart).toStrictEqual({
      ...elodieCart,
      voucher: { code: 'BON-10', status: CartCodeStatus.Applied, discount: 0 }
    })
  })
})
