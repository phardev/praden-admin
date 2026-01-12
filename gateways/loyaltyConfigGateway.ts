import { InMemoryLoyaltyConfigGateway } from '@adapters/secondary/loyalty-config-gateways/inMemoryLoyaltyConfigGateway'
import { RealLoyaltyConfigGateway } from '@adapters/secondary/loyalty-config-gateways/realLoyaltyConfigGateway'
import { isLocalEnv } from '@utils/env'
import { enabledLoyaltyConfig } from '@utils/testData/loyaltyConfig'

const loyaltyConfigGateway = new InMemoryLoyaltyConfigGateway()
loyaltyConfigGateway.feedWith(enabledLoyaltyConfig)

export const useLoyaltyConfigGateway = () => {
  if (isLocalEnv()) {
    return loyaltyConfigGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLoyaltyConfigGateway(BACKEND_URL)
}
