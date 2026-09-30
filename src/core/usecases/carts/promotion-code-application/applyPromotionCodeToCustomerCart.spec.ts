import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { CartCodeStatus, CustomerCartAction } from '@core/entities/cart'
import { applyPromotionCodeToCustomerCart } from '@core/usecases/carts/promotion-code-application/applyPromotionCodeToCustomerCart'
import { useCustomerStore } from '@store/customerStore'
import { elodieCart } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Apply promotion code to customer cart', () => {
  let customerStore: ReturnType<typeof useCustomerStore>
  let cartGateway: InMemoryCartGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithCustomerCarts(elodieCart)
    customerStore.setCurrent({ ...elodieDurand, currentCart: elodieCart })
  })

  it('should show the cart answered for the code', async () => {
    await whenApply()
    expect(customerStore.current?.currentCart).toStrictEqual({
      ...elodieCart,
      promotionCode: {
        code: 'BIENVENUE',
        status: CartCodeStatus.Applied,
        discount: 0
      }
    })
  })

  it('should be updating the cart while the code is checked', async () => {
    const unsubscribe = customerStore.$subscribe((_mutation, state) => {
      expect(state.pendingCartAction).toStrictEqual(
        CustomerCartAction.ApplyPromotionCode
      )
      unsubscribe()
    })
    await whenApply()
  })

  it('should not be updating the cart anymore once the code is checked', async () => {
    await whenApply()
    expect(customerStore.pendingCartAction).toBeUndefined()
  })

  const whenApply = () =>
    applyPromotionCodeToCustomerCart(
      elodieDurand.uuid,
      'BIENVENUE',
      cartGateway
    )
})
