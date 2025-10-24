import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Customer } from '@core/entities/customer'
import { UUID } from '@core/types/types'
import {
  CreateCustomerDTO,
  createCustomer
} from '@core/usecases/customers/customer-creation/createCustomer'
import { useCustomerStore } from '@store/customerStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Create customer', () => {
  let customerStore: any
  const uuidGenerator: FakeUuidGenerator = new FakeUuidGenerator()
  let customerGateway: InMemoryCustomerGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    customerGateway = new InMemoryCustomerGateway(uuidGenerator)
  })
  describe('For a customer', () => {
    const uuid = 'new-uuid'
    const customerDTO: CreateCustomerDTO = {
      firstname: 'Jean',
      lastname: 'Bon',
      email: 'jeanbon@example.com',
      phone: '0987654321'
    }
    const expectedCustomer: Customer = {
      ...customerDTO,
      uuid
    }
    beforeEach(async () => {
      await whenCreateCustomer(uuid, customerDTO)
    })
    it('should save the customer in the store', () => {
      expectStoreToContains(expectedCustomer)
    })
    it('should save the customer in the gateway', async () => {
      await expectGatewayToContains(expectedCustomer)
    })
  })

  describe('For another customer', () => {
    const uuid = 'another-new-uuid'
    const customerDTO: CreateCustomerDTO = {
      firstname: 'Jeanne',
      lastname: "D'arc",
      email: 'jeannedarc@another-example.fr',
      phone: '0123456789'
    }
    const expectedCustomer: Customer = {
      ...customerDTO,
      uuid
    }
    beforeEach(async () => {
      await whenCreateCustomer(uuid, customerDTO)
    })
    it('should save the customer in the store', () => {
      expectStoreToContains(expectedCustomer)
    })
    it('should save the customer in the gateway', async () => {
      await expectGatewayToContains(expectedCustomer)
    })
  })

  const whenCreateCustomer = async (uuid: UUID, dto: CreateCustomerDTO) => {
    uuidGenerator.setNext(uuid)
    await createCustomer(dto, customerGateway)
  }
  const expectStoreToContains = (...categories: Array<Customer>) => {
    expect(customerStore.items).toStrictEqual(categories)
  }

  const expectGatewayToContains = async (...categories: Array<Customer>) => {
    expect(await customerGateway.list(100, 0)).toStrictEqual(categories)
  }
})
