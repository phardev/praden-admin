import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import type { LoyaltyConfig } from '@core/entities/loyalty'
import { getLoyaltyConfig } from '@core/usecases/loyalty/get-loyalty-config/getLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Get Loyalty Config', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway()
  })

  describe('When config exists', () => {
    it('should save the config in the store', async () => {
      const existingConfig: LoyaltyConfig = {
        eurosPerPoint: 15,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-15T00:00:00.000Z'
      }
      givenExistingConfig(existingConfig)
      await whenGetLoyaltyConfig()
      expectConfigToBe(existingConfig)
    })
  })

  describe('When no config exists', () => {
    it('should save the default config in the store', async () => {
      await whenGetLoyaltyConfig()
      expectConfigEurosPerPointToBe(10)
    })
  })

  const givenExistingConfig = (config: LoyaltyConfig) => {
    loyaltyGateway.feedWithConfig(config)
  }

  const whenGetLoyaltyConfig = async () => {
    await getLoyaltyConfig(loyaltyGateway)
  }

  const expectConfigToBe = (config: LoyaltyConfig) => {
    expect(loyaltyStore.config).toStrictEqual(config)
  }

  const expectConfigEurosPerPointToBe = (eurosPerPoint: number) => {
    expect(loyaltyStore.config?.eurosPerPoint).toBe(eurosPerPoint)
  }
})
