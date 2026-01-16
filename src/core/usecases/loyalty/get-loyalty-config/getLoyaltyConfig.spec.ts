import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import type { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import { getLoyaltyConfig } from '@core/usecases/loyalty/get-loyalty-config/getLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Get loyalty config', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway()
  })

  describe('There is no config', () => {
    it('should set null config in store', async () => {
      await whenGetLoyaltyConfig()
      expectLoyaltyConfigToBeNull()
    })
  })

  describe('There is a config', () => {
    it('should set config in store', async () => {
      const config: LoyaltyPointsConfig = {
        pointsPerEuro: 2,
        isActive: true,
        updatedAt: 1700000000000,
        updatedBy: 'admin'
      }
      givenExistingConfig(config)
      await whenGetLoyaltyConfig()
      expectLoyaltyConfigToBe(config)
    })
  })

  const givenExistingConfig = (config: LoyaltyPointsConfig) => {
    loyaltyGateway.feedWithConfig(config)
  }

  const whenGetLoyaltyConfig = async () => {
    await getLoyaltyConfig(loyaltyGateway)
  }

  const expectLoyaltyConfigToBeNull = () => {
    expect(loyaltyStore.config).toBeNull()
  }

  const expectLoyaltyConfigToBe = (config: LoyaltyPointsConfig) => {
    expect(loyaltyStore.config).toStrictEqual(config)
  }
})
