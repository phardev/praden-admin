import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { RealLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/realLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-rule-uuid')
const loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
loyaltyGateway.feedWithConfig({ pointsPerEuro: 10 })

export const useLoyaltyGateway = () => {
  if (isLocalEnv()) {
    return loyaltyGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLoyaltyGateway(BACKEND_URL)
}
