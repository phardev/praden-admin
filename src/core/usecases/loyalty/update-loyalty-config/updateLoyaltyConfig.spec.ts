import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import type { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import { updateLoyaltyConfig } from '@core/usecases/loyalty/update-loyalty-config/updateLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Update loyalty config', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway()
  })

  it('should update config with new pointsPerEuro', async () => {
    givenExistingConfig({
      pointsPerEuro: 1,
      isActive: false,
      updatedAt: 1700000000000,
      updatedBy: 'admin'
    })
    await whenUpdateLoyaltyConfig({ pointsPerEuro: 5 })
    expectLoyaltyConfigPointsPerEuroToBe(5)
  })

  it('should update config with isActive', async () => {
    givenExistingConfig({
      pointsPerEuro: 1,
      isActive: false,
      updatedAt: 1700000000000,
      updatedBy: 'admin'
    })
    await whenUpdateLoyaltyConfig({ isActive: true })
    expectLoyaltyConfigIsActiveToBe(true)
  })

  const givenExistingConfig = (config: LoyaltyPointsConfig) => {
    loyaltyGateway.feedWithConfig(config)
  }

  const whenUpdateLoyaltyConfig = async (dto: {
    pointsPerEuro?: number
    isActive?: boolean
  }) => {
    await updateLoyaltyConfig(dto, loyaltyGateway)
  }

  const expectLoyaltyConfigPointsPerEuroToBe = (value: number) => {
    expect(loyaltyStore.config?.pointsPerEuro).toBe(value)
  }

  const expectLoyaltyConfigIsActiveToBe = (value: boolean) => {
    expect(loyaltyStore.config?.isActive).toBe(value)
  }
})
