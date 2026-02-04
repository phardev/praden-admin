import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { RealLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/RealLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyGateway } from '@core/gateways/loyaltyGateway'
import { isLocalEnv } from '@utils/env'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('loyalty-uuid-1')
const gateway = new InMemoryLoyaltyGateway(uuidGenerator)
gateway.feedConfig({ pointsRatio: 10 })

export const useLoyaltyGateway = (): LoyaltyGateway => {
  if (isLocalEnv()) {
    return gateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLoyaltyGateway(BACKEND_URL)
}
