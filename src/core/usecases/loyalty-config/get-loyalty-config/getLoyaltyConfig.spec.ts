import { InMemoryLoyaltyConfigGateway } from '@adapters/secondary/loyalty-config-gateways/inMemoryLoyaltyConfigGateway'
import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import { getLoyaltyConfig } from '@core/usecases/loyalty-config/get-loyalty-config/getLoyaltyConfig'
import { useLoyaltyConfigStore } from '@store/loyaltyConfigStore'
import { enabledLoyaltyConfig } from '@utils/testData/loyaltyConfig'
import { createPinia, setActivePinia } from 'pinia'

describe('Get loyalty config', () => {
  let loyaltyConfigStore: ReturnType<typeof useLoyaltyConfigStore>
  let loyaltyConfigGateway: InMemoryLoyaltyConfigGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyConfigStore = useLoyaltyConfigStore()
    loyaltyConfigGateway = new InMemoryLoyaltyConfigGateway()
  })

  describe('Get loyalty config', () => {
    it('should save the loyalty config in the store', async () => {
      givenExistingLoyaltyConfig(enabledLoyaltyConfig)
      await whenGetLoyaltyConfig()
      expectCurrentLoyaltyConfigToBe(enabledLoyaltyConfig)
    })
  })

  const givenExistingLoyaltyConfig = (config: LoyaltyConfig) => {
    loyaltyConfigGateway.feedWith(config)
  }

  const whenGetLoyaltyConfig = async () => {
    await getLoyaltyConfig(loyaltyConfigGateway)
  }

  const expectCurrentLoyaltyConfigToBe = (config: LoyaltyConfig) => {
    expect(loyaltyConfigStore.config).toStrictEqual(config)
  }
})
