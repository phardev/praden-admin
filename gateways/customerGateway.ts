import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { RealCustomerGateway } from '@adapters/secondary/customer-gateways/RealCustomerGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as customers from '@utils/testData/customers'

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
