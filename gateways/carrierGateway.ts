import * as carriers from '@utils/testData/carriers'
import { RealCarrierGateway } from '@adapters/secondary/carrier-gateways/realCarrierGateway'
import { isLocalEnv } from '@utils/env'
import { InMemoryCarrierGateway } from '@adapters/secondary/carrier-gateways/InMemoryCarrierGateway'

const carrierGateway = new InMemoryCarrierGateway()
carrierGateway.feedWith(...Object.values(carriers))

export const useCarrierGateway = () => {
  if (isLocalEnv()) {
    return carrierGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealCarrierGateway(BACKEND_URL)
}
