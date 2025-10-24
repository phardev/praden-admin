import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Customer } from '@core/entities/customer'
import { CustomerDoesNotExistsError } from '@core/errors/CustomerDoesNotExistsError'
import { UUID } from '@core/types/types'
import {
  EditCustomerDTO,
  editCustomer
} from '@core/usecases/customers/customer-edition/editCustomer'
import { useCustomerStore } from '@store/customerStore'
import {
  elodieDurand,
  lucasLefevre,
  sophieMartinez
} from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'

describe('Customer Edition', () => {
  let customerStore: any
  let customerGateway: InMemoryCustomerGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    customerGateway = new InMemoryCustomerGateway(new FakeUuidGenerator())
  })
  describe('The customer exists', () => {
    beforeEach(() => {
      givenExistingCustomers(elodieDurand, lucasLefevre, sophieMartinez)
    })
    describe('For a customer', () => {
      const customer = elodieDurand
      const dto: EditCustomerDTO = {
        email: 'new@email.com'
      }
      const expectedCustomer: Customer = {
        ...customer,
        ...dto
      }
      const expectedRes: Array<Customer> = [
        expectedCustomer,
        lucasLefevre,
        sophieMartinez
      ]
      beforeEach(async () => {
        await whenEditCustomer(customer.uuid, dto)
      })
      it('should edit the customer in the gateway', async () => {
        expect(await customerGateway.list(100, 0)).toStrictEqual(expectedRes)
      })
      it('should edit the customer in the store', async () => {
        expect(customerStore.items).toStrictEqual(expectedRes)
      })
    })
    describe('For another customer', () => {
      const customer = lucasLefevre
      const dto: EditCustomerDTO = {
        firstname: 'New firstname',
        phone: '0879879870'
      }
      const expectedCustomer: Customer = {
        ...customer,
        ...dto
      }
      const expectedRes: Array<Customer> = [
        elodieDurand,
        expectedCustomer,
        sophieMartinez
      ]
      beforeEach(async () => {
        await whenEditCustomer(customer.uuid, dto)
      })
      it('should edit the customer in the gateway', async () => {
        expect(await customerGateway.list(100, 0)).toStrictEqual(expectedRes)
      })
      it('should edit the customer in the store', async () => {
        expect(customerStore.items).toStrictEqual(expectedRes)
      })
    })
  })
  describe('The customer does not exists', () => {
    it('should throw an error', async () => {
      await expect(
        whenEditCustomer('NotExists', { lastname: 'NewName' })
      ).rejects.toThrow(CustomerDoesNotExistsError)
    })
  })

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerGateway.feedWith(...JSON.parse(JSON.stringify(customers)))
    customerStore.items = JSON.parse(JSON.stringify(customers))
  }

  const whenEditCustomer = async (
    uuid: UUID,
    dto: EditCustomerDTO
  ): Promise<void> => {
    await editCustomer(uuid, dto, customerGateway)
  }
})
