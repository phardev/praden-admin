import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { RealLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/realLoyaltyGateway'
import { isLocalEnv } from '@utils/env'

const loyaltyGateway = new InMemoryLoyaltyGateway()
loyaltyGateway.feedWithConfig({
  pointsPerEuro: 1,
  isActive: true,
  updatedAt: Date.now(),
  updatedBy: 'system'
})

export const useLoyaltyGateway = () => {
  if (isLocalEnv()) {
    return loyaltyGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLoyaltyGateway(BACKEND_URL)
}
