import { InMemoryTimeoutProductGateway } from '@adapters/secondary/product-gateways/InMemoryTimeoutProductGateway'
import { RealProductGateway } from '@adapters/secondary/product-gateways/RealProductGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as products from '@utils/testData/products'

export const useProductGateway = () => {
  if (isLocalEnv()) {
    return inMemory.getInstance()
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealProductGateway(BACKEND_URL)
}

const inMemory = (() => {
  let instance: any

  const createInstance = () => {
    const uuidGenerator = new FakeUuidGenerator()
    uuidGenerator.setNext('new-uuid-123')
    const gateway = new InMemoryTimeoutProductGateway(500, uuidGenerator)
    gateway.feedWith(...Object.values(products))
    return gateway
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    }
  }
})()
