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
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

describe('Customer listing', () => {
  let customerStore: any
  let customerGateway: InMemoryCustomerGateway
  let limit: number
  let offset: number

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    customerGateway = new InMemoryCustomerGateway(new FakeUuidGenerator())
    limit = 10
    offset = 0
  })
  describe('There is no customer', () => {
    it('should list nothing', async () => {
      await whenListCustomers()
      expectStoreToEquals()
    })
  })
  describe('There is some customers', () => {
    const customers = [elodieDurand, lucasLefevre, sophieMartinez]
    beforeEach(async () => {
      givenExistingCustomers(...customers)
      await whenListCustomers()
    })
    it('should list all of them', () => {
      expectStoreToEquals(...customers)
    })
    it('should be aware that its over', async () => {
      limit = 20
      offset = 10
      await whenListCustomers()
      expectHasMoreToBe(false)
    })
  })

  describe('There is a limit and an offset', () => {
    const customers = [elodieDurand, lucasLefevre, sophieMartinez]
    beforeEach(async () => {
      givenExistingCustomers(...customers)
      limit = 1
      offset = 1
      await whenListCustomers()
    })
    it('should list a part of them', () => {
      expectStoreToEquals(lucasLefevre)
    })
    it('should be aware that its not over', () => {
      expectHasMoreToBe(true)
    })
  })

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerGateway.feedWith(...customers)
  }

  const whenListCustomers = async () => {
    await listCustomers(limit, offset, customerGateway)
  }

  const expectStoreToEquals = (...customers: Array<Customer>) => {
    expect(customerStore.items).toStrictEqual(customers)
  }

  const expectHasMoreToBe = (hasMore: boolean) => {
    expect(customerStore.hasMore).toBe(hasMore)
  }
})
