import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { RealLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/realLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as loyaltyConfig from '@utils/testData/loyaltyConfig'
import { customerLoyaltyWithTransactions } from '@utils/testData/loyaltyPointsTransactions'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-uuid')
const loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
loyaltyGateway.feedWithConfig(loyaltyConfig.loyaltyConfigWithMultipliers)
loyaltyGateway.feedWithCustomerLoyalty(
  'customer-1',
  customerLoyaltyWithTransactions
)

export const useLoyaltyGateway = () => {
  if (isLocalEnv()) {
    return loyaltyGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLoyaltyGateway(BACKEND_URL)
}
