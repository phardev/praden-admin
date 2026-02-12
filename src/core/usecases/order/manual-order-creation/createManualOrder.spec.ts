import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import type { Order } from '@core/entities/order'
import { useOrderStore } from '@store/orderStore'
import { orderToPrepare1 } from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'
import type { CreateManualOrderDTO } from './createManualOrder'
import { createManualOrder } from './createManualOrder'

describe('Create manual order', () => {
  let orderStore: any
  let orderGateway: InMemoryOrderGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    orderStore = useOrderStore()
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
  })

  describe('Creating a manual order', () => {
    const dto: CreateManualOrderDTO = {
      customer: {
        firstname: 'Jean',
        lastname: 'Bon',
        email: 'jeanbon@anotheremail.com',
        phone: '0123456789'
      },
      deliveryAddress: {
        firstname: 'Jean',
        lastname: 'Bon',
        address: '10 rue des peupliers',
        zip: '12345',
        city: 'PlopLand',
        country: 'Plop'
      },
      billingAddress: {
        firstname: 'Jean',
        lastname: 'Bon',
        address: '10 rue des peupliers',
        zip: '12345',
        city: 'PlopLand',
        country: 'Plop'
      },
      lines: [
        {
          productUuid: 'product-1',
          priceWithoutTax: 500,
          percentTaxRate: 2000,
          quantity: 2,
          weight: 100
        }
      ],
      deliveryMethodUuid: 'delivery-method-1'
    }

    beforeEach(async () => {
      orderGateway.feedWithCreated(orderToPrepare1)
      await whenCreateManualOrder(dto)
    })

    it('should set the created order as current in the store', () => {
      expect(orderStore.current).toStrictEqual(orderToPrepare1)
    })
  })

  describe('Loading', () => {
    const dto: CreateManualOrderDTO = {
      customer: {
        firstname: 'Jean',
        lastname: 'Bon',
        email: 'jeanbon@anotheremail.com',
        phone: '0123456789'
      },
      deliveryAddress: {
        firstname: 'Jean',
        lastname: 'Bon',
        address: '10 rue des peupliers',
        zip: '12345',
        city: 'PlopLand',
        country: 'Plop'
      },
      billingAddress: {
        firstname: 'Jean',
        lastname: 'Bon',
        address: '10 rue des peupliers',
        zip: '12345',
        city: 'PlopLand',
        country: 'Plop'
      },
      lines: [
        {
          productUuid: 'product-1',
          priceWithoutTax: 500,
          percentTaxRate: 2000,
          quantity: 2,
          weight: 100
        }
      ],
      deliveryMethodUuid: 'delivery-method-1'
    }

    it('should be aware during loading', async () => {
      orderGateway.feedWithCreated(orderToPrepare1)
      const unsubscribe = orderStore.$subscribe(
        (mutation: unknown, state: typeof orderStore.$state) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenCreateManualOrder(dto)
    })

    it('should be aware when loading is done', async () => {
      orderGateway.feedWithCreated(orderToPrepare1)
      await whenCreateManualOrder(dto)
      expect(orderStore.isLoading).toBe(false)
    })
  })

  const whenCreateManualOrder = async (dto: CreateManualOrderDTO) => {
    await createManualOrder(dto, orderGateway)
  }
})
