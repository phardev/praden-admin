import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { RealLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/realLoyaltyGateway'
import { isLocalEnv } from '@utils/env'

const inMemoryLoyaltyGateway = new InMemoryLoyaltyGateway()
inMemoryLoyaltyGateway.feedWithConfig({
  eurosPerPoint: 10,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
})

export const useLoyaltyGateway = () => {
  if (isLocalEnv()) {
    return inMemoryLoyaltyGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLoyaltyGateway(BACKEND_URL)
}
