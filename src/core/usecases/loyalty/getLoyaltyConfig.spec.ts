import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyConfig } from '@core/entities/loyalty'
import { getLoyaltyConfig } from '@core/usecases/loyalty/getLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Get loyalty config', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('When no config exists', () => {
    it('should set config to null in store', async () => {
      await whenGetLoyaltyConfig()
      expect(loyaltyStore.config).toBeNull()
    })
  })

  describe('When config exists', () => {
    const existingConfig: LoyaltyConfig = { pointsRatio: 10 }

    beforeEach(() => {
      givenExistingConfig(existingConfig)
    })

    it('should set config in store', async () => {
      await whenGetLoyaltyConfig()
      expect(loyaltyStore.config).toStrictEqual(existingConfig)
    })
  })

  const givenExistingConfig = (config: LoyaltyConfig) => {
    loyaltyGateway.feedConfig(config)
  }

  const whenGetLoyaltyConfig = async () => {
    await getLoyaltyConfig(loyaltyGateway)
  }
})
