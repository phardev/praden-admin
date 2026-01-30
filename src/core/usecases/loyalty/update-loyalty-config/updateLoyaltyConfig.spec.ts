import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import type { LoyaltyConfig } from '@core/entities/loyalty'
import { updateLoyaltyConfig } from '@core/usecases/loyalty/update-loyalty-config/updateLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Update Loyalty Config', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway()
  })

  describe('When updating config', () => {
    it('should save the updated config in the store', async () => {
      await whenUpdateLoyaltyConfig(20)
      expectConfigEurosPerPointToBe(20)
    })
  })

  describe('When updating config to different value', () => {
    it('should save the updated config in the store', async () => {
      await whenUpdateLoyaltyConfig(5)
      expectConfigEurosPerPointToBe(5)
    })
  })

  describe('When config already exists', () => {
    it('should update the config with new value', async () => {
      const existingConfig: LoyaltyConfig = {
        eurosPerPoint: 15,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-15T00:00:00.000Z'
      }
      givenExistingConfig(existingConfig)
      await whenUpdateLoyaltyConfig(25)
      expectConfigEurosPerPointToBe(25)
    })
  })

  const givenExistingConfig = (config: LoyaltyConfig) => {
    loyaltyGateway.feedWithConfig(config)
  }

  const whenUpdateLoyaltyConfig = async (eurosPerPoint: number) => {
    await updateLoyaltyConfig(eurosPerPoint, loyaltyGateway)
  }

  const expectConfigEurosPerPointToBe = (eurosPerPoint: number) => {
    expect(loyaltyStore.config?.eurosPerPoint).toBe(eurosPerPoint)
  }
})
