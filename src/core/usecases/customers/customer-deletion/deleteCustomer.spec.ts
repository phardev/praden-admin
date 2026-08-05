import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Customer } from '@core/entities/customer'
import { CustomerDoesNotExistsError } from '@core/errors/CustomerDoesNotExistsError'
import { useCustomerStore } from '@store/customerStore'
import { useSearchStore } from '@store/searchStore'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'
import { deleteCustomer } from './deleteCustomer'

describe('Delete customer', () => {
  let customerStore: any
  let customerGateway: InMemoryCustomerGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    customerGateway = new InMemoryCustomerGateway(uuidGenerator)
  })

  describe('Given existing customers', () => {
    beforeEach(() => {
      givenThereIsExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
    })

    describe('For deleting an existing customer', () => {
      it('should remove the customer from the gateway', async () => {
        await whenDeleteCustomer(elodieDurand.uuid)

        await expectCustomerGatewayToEqual(lucasLefevre, sophieMartinez)
      })

      it('should remove the customer from the store', async () => {
        await whenDeleteCustomer(lucasLefevre.uuid)

        expectCustomerStoreToEqual(elodieDurand, sophieMartinez)
      })

      describe('The deleted customer is the current one', () => {
        beforeEach(() => {
          customerStore.current = JSON.parse(JSON.stringify(sophieMartinez))
        })

        it('should clear the current customer', async () => {
          await whenDeleteCustomer(sophieMartinez.uuid)

          expect(customerStore.current).toBeUndefined()
        })
      })

      describe('The deleted customer is in search results', () => {
        let searchStore: any

        beforeEach(() => {
          searchStore = useSearchStore()
          searchStore.set(
            'customers',
            JSON.parse(JSON.stringify([elodieDurand, sophieMartinez]))
          )
        })

        it('should remove the customer from the search results', async () => {
          await whenDeleteCustomer(elodieDurand.uuid)

          expect(searchStore.get('customers')).toStrictEqual([sophieMartinez])
        })
      })

      describe('The deleted customer is not the current one', () => {
        beforeEach(() => {
          customerStore.current = JSON.parse(JSON.stringify(elodieDurand))
        })

        it('should keep the current customer', async () => {
          await whenDeleteCustomer(sophieMartinez.uuid)

          expect(customerStore.current).toStrictEqual(elodieDurand)
        })
      })
    })

    describe('For deleting a non-existing customer', () => {
      it('should throw CustomerDoesNotExistsError', async () => {
        const nonExistingUuid = 'non-existing-uuid'

        await expect(whenDeleteCustomer(nonExistingUuid)).rejects.toThrow(
          new CustomerDoesNotExistsError(nonExistingUuid)
        )
      })
    })
  })

  describe('Given no existing customers', () => {
    it('should throw CustomerDoesNotExistsError', async () => {
      const nonExistingUuid = 'non-existing-uuid'

      await expect(whenDeleteCustomer(nonExistingUuid)).rejects.toThrow(
        new CustomerDoesNotExistsError(nonExistingUuid)
      )
    })
  })

  const givenThereIsExistingCustomers = (...customers: Array<Customer>) => {
    customerGateway.feedWith(...customers)
    customerStore.items = JSON.parse(JSON.stringify(customers))
  }

  const whenDeleteCustomer = async (uuid: string) => {
    await deleteCustomer(uuid, customerGateway)
  }

  const expectCustomerStoreToEqual = (...customers: Array<Customer>) => {
    expect(customerStore.items).toStrictEqual(customers)
  }

  const expectCustomerGatewayToEqual = async (
    ...customers: Array<Customer>
  ) => {
    expect(await customerGateway.list(100, 0)).toStrictEqual(customers)
  }
})
