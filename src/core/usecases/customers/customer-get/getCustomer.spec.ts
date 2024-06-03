import { UUID } from '@core/types/types'
import { createPinia, setActivePinia } from 'pinia'
import { useCustomerStore } from '@store/customerStore'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'

import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { getCustomer } from '@core/usecases/customers/customer-get/getCustomer'
import { CustomerDoesNotExistsError } from '@core/errors/CustomerDoesNotExistsError'
import { Customer } from '@core/entities/customer'

describe('Get customer', () => {
  let customerStore: any
  let customerGateway: InMemoryCustomerGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    customerGateway = new InMemoryCustomerGateway()
  })
  describe('The customer exists', () => {
    beforeEach(async () => {
      givenExistingCustomers(sophieMartinez, lucasLefevre, elodieDurand)
      await whenGetCustomer(lucasLefevre.uuid)
    })
    it('should store it in customer store', () => {
      expect(customerStore.current).toStrictEqual(lucasLefevre)
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

  const whenGetCustomer = async (uuid: UUID) => {
    await getCustomer(uuid, customerGateway)
  }
})
