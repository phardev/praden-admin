import { InMemoryLoyaltyPointsConfigGateway } from '@adapters/secondary/loyalty-points-config-gateways/inMemoryLoyaltyPointsConfigGateway'
import { RealLoyaltyPointsConfigGateway } from '@adapters/secondary/loyalty-points-config-gateways/realLoyaltyPointsConfigGateway'
import { isLocalEnv } from '@utils/env'
import { useUuidGenerator } from './uuidGenerator'

const loyaltyPointsConfigGateway = new InMemoryLoyaltyPointsConfigGateway(
  useUuidGenerator()
)
loyaltyPointsConfigGateway.feedWith({
  uuid: 'loyalty-config-uuid',
  pointsPerEuro: 1,
  minimumOrderAmount: 0,
  isActive: true
})

export const useLoyaltyPointsConfigGateway = () => {
  if (isLocalEnv()) {
    return loyaltyPointsConfigGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLoyaltyPointsConfigGateway(BACKEND_URL)
}
