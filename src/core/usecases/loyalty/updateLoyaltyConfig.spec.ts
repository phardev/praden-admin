import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyConfig } from '@core/entities/loyalty'
import { updateLoyaltyConfig } from '@core/usecases/loyalty/updateLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Update loyalty config', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('When updating config', () => {
    const newConfig: LoyaltyConfig = { pointsRatio: 20 }

    beforeEach(async () => {
      await whenUpdateLoyaltyConfig(newConfig)
    })

    it('should update config in gateway', async () => {
      expect(await loyaltyGateway.getConfig()).toStrictEqual(newConfig)
    })

    it('should update config in store', () => {
      expect(loyaltyStore.config).toStrictEqual(newConfig)
    })
  })

  const whenUpdateLoyaltyConfig = async (config: LoyaltyConfig) => {
    await updateLoyaltyConfig(config, loyaltyGateway)
  }
})
