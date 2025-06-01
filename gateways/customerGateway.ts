import * as customers from '@utils/testData/customers'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { isLocalEnv } from '@utils/env'
import { RealCustomerGateway } from '@adapters/secondary/customer-gateways/RealCustomerGateway'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-uuid')
const customerGateway = new InMemoryCustomerGateway(uuidGenerator)
customerGateway.feedWith(...Object.values(customers))

export const useCustomerGateway = () => {
  if (isLocalEnv()) {
    return customerGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealCustomerGateway(BACKEND_URL)
}
