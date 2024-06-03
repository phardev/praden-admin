import * as customers from '@utils/testData/customers'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-uuid')
const customerGateway = new InMemoryCustomerGateway(uuidGenerator)
customerGateway.feedWith(...Object.values(customers))

export const useCustomerGateway = () => {
  return customerGateway
}
