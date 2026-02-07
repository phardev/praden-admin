import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyConfig } from '@core/entities/loyalty/loyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { updateLoyaltyConfig } from './updateLoyaltyConfig'

describe('Update loyalty config', () => {
  let loyaltyStore: any
  let loyaltyGateway: InMemoryLoyaltyGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
  })

  describe('Given an existing config', () => {
    const existingConfig: LoyaltyConfig = { pointsPerEuro: 0.1 }

    beforeEach(() => {
      loyaltyGateway.feedWithConfig(existingConfig)
      loyaltyStore.setConfig(existingConfig)
    })

    it('should update the config in the store', async () => {
      await whenUpdateLoyaltyConfig(0.5)
      expect(loyaltyStore.config).toStrictEqual({ pointsPerEuro: 0.5 })
    })

    it('should update the config in the gateway', async () => {
      await whenUpdateLoyaltyConfig(0.5)
      const result = await loyaltyGateway.getConfig()
      expect(result.config).toStrictEqual({ pointsPerEuro: 0.5 })
    })
  })

  describe('For another value', () => {
    const existingConfig: LoyaltyConfig = { pointsPerEuro: 0.5 }

    beforeEach(() => {
      loyaltyGateway.feedWithConfig(existingConfig)
      loyaltyStore.setConfig(existingConfig)
    })

    it('should update the config in the store', async () => {
      await whenUpdateLoyaltyConfig(1)
      expect(loyaltyStore.config).toStrictEqual({ pointsPerEuro: 1 })
    })
  })

  const whenUpdateLoyaltyConfig = async (pointsPerEuro: number) => {
    await updateLoyaltyConfig(pointsPerEuro, loyaltyGateway)
  }
})
