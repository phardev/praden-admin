import { useCustomerStore } from '@store/customerStore'
import { listCustomers } from '@core/usecases/customers/customer-listing/listCustomer'
import { createPinia, setActivePinia } from 'pinia'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'
import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { Customer } from '@core/entities/customer'

describe('Customer listing', () => {
  let customerStore: any
  let customerGateway: InMemoryCustomerGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    customerGateway = new InMemoryCustomerGateway()
  })
  describe('There is no customer', () => {
    it('should list nothing', async () => {
      await whenListCustomers()
      expectStoreToEquals()
    })
  })
  describe('There is some customers', () => {
    it('should list all of them', async () => {
      const customers = [elodieDurand, lucasLefevre, sophieMartinez]
      givenExistingCustomers(...customers)
      await whenListCustomers()
      expectStoreToEquals(...customers)
    })
  })

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerGateway.feedWith(...customers)
  }

  const whenListCustomers = async () => {
    await listCustomers(customerGateway)
  }

  const expectStoreToEquals = (...customers: Array<Customer>) => {
    expect(customerStore.items).toStrictEqual(customers)
  }
})
