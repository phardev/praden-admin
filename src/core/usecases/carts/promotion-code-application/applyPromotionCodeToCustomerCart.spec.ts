import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { CartAction, CartCodeStatus } from '@core/entities/cart'
import { applyPromotionCodeToCustomerCart } from '@core/usecases/carts/promotion-code-application/applyPromotionCodeToCustomerCart'
import { useCartDetailStore } from '@store/cartDetailStore'
import { elodieCart, elodieCartDetail } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Apply promotion code to customer cart', () => {
  let cartDetailStore: ReturnType<typeof useCartDetailStore>
  let cartGateway: InMemoryCartGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    cartDetailStore = useCartDetailStore()
    cartGateway = new InMemoryCartGateway()
    cartGateway.feedWithCustomerCarts(elodieCart)
    cartDetailStore.setCurrent(elodieCart)
  })

  it('should show the cart answered for the code', async () => {
    await whenApply()
    expect(cartDetailStore.current).toStrictEqual({
      ...elodieCart,
      promotionCode: {
        code: 'BIENVENUE',
        status: CartCodeStatus.Applied,
        discount: 0
      }
    })
  })

  it('should keep the status and the customer of the cart shown', async () => {
    cartDetailStore.setCurrent({ ...elodieCartDetail, ...elodieCart })
    await whenApply()
    expect({
      status: cartDetailStore.current?.status,
      customer: cartDetailStore.current?.customer
    }).toStrictEqual({
      status: elodieCartDetail.status,
      customer: elodieCartDetail.customer
    })
  })

  it('should be updating the cart while the code is checked', async () => {
    const unsubscribe = cartDetailStore.$subscribe((_mutation, state) => {
      expect(state.pendingAction).toStrictEqual(CartAction.ApplyPromotionCode)
      unsubscribe()
    })
    await whenApply()
  })

  it('should not be updating the cart anymore once the code is checked', async () => {
    await whenApply()
    expect(cartDetailStore.pendingAction).toBeUndefined()
  })

  it('should not be updating the cart anymore when the code is refused', async () => {
    await applyPromotionCodeToCustomerCart(
      'unknown-customer',
      'BIENVENUE',
      cartGateway
    ).catch(() => undefined)
    expect(cartDetailStore.pendingAction).toBeUndefined()
  })

  const whenApply = () =>
    applyPromotionCodeToCustomerCart(
      elodieDurand.uuid,
      'BIENVENUE',
      cartGateway
    )
})
