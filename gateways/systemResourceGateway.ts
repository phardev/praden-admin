import { InMemorySystemResourceGateway } from '@adapters/secondary/system-resource-gateways/InMemorySystemResourceGateway'
import { RealSystemResourceGateway } from '@adapters/secondary/system-resource-gateways/RealSystemResourceGateway'
import { isLocalEnv } from '@utils/env'
import * as systemResources from '@utils/testData/systemResources'

const systemResourceGateway = new InMemorySystemResourceGateway()
systemResourceGateway.feedWith(...systemResources.systemResources)

export const useSystemResourceGateway = () => {
  if (isLocalEnv()) {
    return systemResourceGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealSystemResourceGateway(BACKEND_URL)
}
