import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import { getLoyaltyConfig } from '@core/usecases/loyalty/get-loyalty-config/getLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import {
  loyaltyConfigEmpty,
  loyaltyConfigWithMultipliers
} from '@utils/testData/loyaltyConfig'
import { createPinia, setActivePinia } from 'pinia'

describe('Get loyalty config', () => {
  let store: ReturnType<typeof useLoyaltyStore>
  let gateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLoyaltyStore()
    gateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('Config with multipliers', () => {
    it('should set the config in the store', async () => {
      givenConfig(loyaltyConfigWithMultipliers)
      await whenGetLoyaltyConfig()
      expect(store.config).toStrictEqual(loyaltyConfigWithMultipliers)
    })
  })

  describe('Empty config', () => {
    it('should set the default config in the store', async () => {
      await whenGetLoyaltyConfig()
      expect(store.config).toStrictEqual(loyaltyConfigEmpty)
    })
  })

  const givenConfig = (config: LoyaltyConfig) => {
    gateway.feedWithConfig(config)
  }

  const whenGetLoyaltyConfig = async () => {
    await getLoyaltyConfig(gateway)
  }
})
