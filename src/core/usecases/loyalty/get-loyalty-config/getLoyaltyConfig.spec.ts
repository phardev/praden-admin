import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import { getLoyaltyConfig } from '@core/usecases/loyalty/get-loyalty-config/getLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { defaultLoyaltyConfig } from '@utils/testData/loyalty'
import { createPinia, setActivePinia } from 'pinia'

describe('Get loyalty config', () => {
  let loyaltyGateway: InMemoryLoyaltyGateway
  let loyaltyStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
    loyaltyStore = useLoyaltyStore()
  })

  describe('Config exists', () => {
    beforeEach(async () => {
      givenExistingConfig(defaultLoyaltyConfig)
      await whenGetLoyaltyConfig()
    })

    it('should store the config', () => {
      expect(loyaltyStore.config).toStrictEqual(defaultLoyaltyConfig)
    })
  })

  describe('No config exists', () => {
    beforeEach(async () => {
      await whenGetLoyaltyConfig()
    })

    it('should store null config', () => {
      expect(loyaltyStore.config).toBeNull()
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = loyaltyStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenGetLoyaltyConfig()
    })

    it('should be aware that loading is over', async () => {
      await whenGetLoyaltyConfig()
      expect(loyaltyStore.isLoading).toBe(false)
    })
  })

  const givenExistingConfig = (config: LoyaltyPointsConfig) => {
    loyaltyGateway.feedWithConfig(config)
  }

  const whenGetLoyaltyConfig = async () => {
    await getLoyaltyConfig(loyaltyGateway)
  }
})
