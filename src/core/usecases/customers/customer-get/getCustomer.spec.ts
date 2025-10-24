import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryOrderGateway } from '@adapters/secondary/order-gateways/InMemoryOrderGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Customer } from '@core/entities/customer'
import { Order } from '@core/entities/order'
import { CustomerDoesNotExistsError } from '@core/errors/CustomerDoesNotExistsError'
import { UUID } from '@core/types/types'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { useCustomerStore } from '@store/customerStore'
import { useOrderStore } from '@store/orderStore'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'
import {
  elodieDurandOrder1,
  elodieDurandOrder2,
  lucasLefevreOrder1,
  lucasLefevreOrder2
} from '@utils/testData/orders'
import { createPinia, setActivePinia } from 'pinia'

describe('Get customer', () => {
  let customerStore: any
  let customerGateway: InMemoryCustomerGateway
  let orderStore: any
  let orderGateway: InMemoryOrderGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    orderStore = useOrderStore()
    customerGateway = new InMemoryCustomerGateway(new FakeUuidGenerator())
    orderGateway = new InMemoryOrderGateway(new FakeDateProvider())
  })
  describe('The customer exists', () => {
    beforeEach(async () => {
      givenExistingCustomers(sophieMartinez, lucasLefevre, elodieDurand)
      givenExistingOrders(lucasLefevreOrder1, lucasLefevreOrder2)
      await whenGetCustomer(lucasLefevre.uuid)
    })
    it('should store it in customer store', () => {
      expect(customerStore.current).toStrictEqual(lucasLefevre)
    })
  })
  describe('There is already loaded orders', () => {
    beforeEach(async () => {
      givenExistingCustomers(sophieMartinez, lucasLefevre, elodieDurand)
      givenExistingOrders(
        elodieDurandOrder1,
        elodieDurandOrder2,
        lucasLefevreOrder1,
        lucasLefevreOrder2
      )
      orderStore.items = [lucasLefevreOrder1, lucasLefevreOrder2]
      await whenGetCustomer(elodieDurand.uuid)
    })
    it('should store it in customer store', () => {
      expect(customerStore.current).toStrictEqual(elodieDurand)
    })
  })
  describe('The customer does not exists', () => {
    it('should throw an error', async () => {
      await expect(whenGetCustomer('NotExists')).rejects.toThrow(
        CustomerDoesNotExistsError
      )
    })
  })

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerGateway.feedWith(...customers)
  }

  const givenExistingOrders = (...orders: Array<Order>) => {
    orderGateway.feedWith(...orders)
  }

  const whenGetCustomer = async (uuid: UUID) => {
    await getCustomer(uuid, customerGateway)
  }
})
