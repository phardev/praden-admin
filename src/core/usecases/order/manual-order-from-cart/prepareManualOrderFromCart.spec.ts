import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { prepareManualOrderFromCart } from '@core/usecases/order/manual-order-from-cart/prepareManualOrderFromCart'
import { useManualOrderDraftStore } from '@store/manualOrderDraftStore'
import { elodieCart } from '@utils/testData/carts'
import { elodieDurand } from '@utils/testData/customers'
import { calmosine, chamomilla, dolodent } from '@utils/testData/products'
import { createPinia, setActivePinia } from 'pinia'

describe('Prepare manual order from cart', () => {
  it('should keep the customer with the catalog products of the cart', async () => {
    setActivePinia(createPinia())
    const customerGateway = new InMemoryCustomerGateway(new FakeUuidGenerator())
    const productGateway = new InMemoryProductGateway(new FakeUuidGenerator())
    const customer = { ...elodieDurand, currentCart: elodieCart }
    customerGateway.feedWith(customer)
    productGateway.feedWith(dolodent, chamomilla, calmosine)
    await prepareManualOrderFromCart(
      elodieDurand.uuid,
      customerGateway,
      productGateway
    )
    expect(useManualOrderDraftStore().draft).toStrictEqual({
      customer,
      products: [dolodent, chamomilla]
    })
  })
})
