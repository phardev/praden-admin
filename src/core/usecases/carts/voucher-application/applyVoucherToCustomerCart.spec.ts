import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { CartCodeStatus } from '@core/entities/cart'
import { applyVoucherToCustomerCart } from '@core/usecases/carts/voucher-application/applyVoucherToCustomerCart'
import { useCartDetailStore } from '@store/cartDetailStore'
import { elodieCart } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Apply voucher to customer cart', () => {
  it('should show the cart answered for the voucher', async () => {
    setActivePinia(createPinia())
    const cartDetailStore = useCartDetailStore()
    const cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithCustomerCarts(elodieCart)
    cartDetailStore.setCurrent(elodieCart)
    await applyVoucherToCustomerCart(elodieDurand.uuid, 'BON-10', cartGateway)
    expect(cartDetailStore.current).toStrictEqual({
      ...elodieCart,
      voucher: { code: 'BON-10', status: CartCodeStatus.Applied, discount: 0 }
    })
  })
})
