import { RealProductGateway } from '@adapters/secondary/product-gateways/RealProductGateway'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import * as products from '@utils/testData/products'
import { isLocalEnv } from '@utils/env'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'

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
    const gateway = new InMemoryProductGateway(uuidGenerator)
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
