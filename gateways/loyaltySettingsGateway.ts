import { InMemoryLoyaltySettingsGateway } from '@adapters/secondary/loyalty-settings-gateways/InMemoryLoyaltySettingsGateway'
import { RealLoyaltySettingsGateway } from '@adapters/secondary/loyalty-settings-gateways/RealLoyaltySettingsGateway'
import { isLocalEnv } from '@utils/env'

const loyaltySettingsGateway = new InMemoryLoyaltySettingsGateway()

export const useLoyaltySettingsGateway = () => {
  if (isLocalEnv()) {
    return loyaltySettingsGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLoyaltySettingsGateway(BACKEND_URL)
}
