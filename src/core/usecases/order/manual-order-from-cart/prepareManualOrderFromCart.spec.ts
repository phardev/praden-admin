import { InMemoryCartGateway } from '@adapters/secondary/cart-gateways/InMemoryCartGateway'
import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { prepareManualOrderFromCart } from '@core/usecases/order/manual-order-from-cart/prepareManualOrderFromCart'
import { useManualOrderDraftStore } from '@store/manualOrderDraftStore'
import { elodieCartDetail, guestCartDetail } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { calmosine, chamomilla, dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Prepare manual order from cart', () => {
  let cartGateway: InMemoryCartGateway
  let customerGateway: InMemoryCustomerGateway
  let productGateway: InMemoryProductGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    cartGateway = new InMemoryCartGateway()
    customerGateway = new InMemoryCustomerGateway(new FakeUuidGenerator())
    productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
    cartGateway.feedWithCartDetails(elodieCartDetail, guestCartDetail)
    customerGateway.feedWith(elodieDurand)
    productGateway.feedWith(dolodent, chamomilla, calmosine)
  })

  it('should keep the cart of a customer with the customer and the catalog products', async () => {
    await whenPrepare(elodieCartDetail.uuid!)
    expect(useManualOrderDraftStore().draft).toStrictEqual({
      cart: elodieCartDetail,
      customer: elodieDurand,
      products: [dolodent]
    })
  })

  it('should keep the cart of a visitor without customer', async () => {
    await whenPrepare(guestCartDetail.uuid!)
    expect(useManualOrderDraftStore().draft).toStrictEqual({
      cart: guestCartDetail,
      products: [dolodent]
    })
  })

  const whenPrepare = (cartUuid: string) =>
    prepareManualOrderFromCart(
      cartUuid,
      cartGateway,
      customerGateway,
      productGateway
    )
})
