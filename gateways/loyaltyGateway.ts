import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { RealLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/RealLoyaltyGateway'
import { isLocalEnv } from '@utils/env'

const loyaltyGateway = new InMemoryLoyaltyGateway()

export const useLoyaltyGateway = () => {
  if (isLocalEnv()) {
    return loyaltyGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLoyaltyGateway(BACKEND_URL)
}
