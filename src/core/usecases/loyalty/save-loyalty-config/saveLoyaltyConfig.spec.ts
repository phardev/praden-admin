import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import { saveLoyaltyConfig } from '@core/usecases/loyalty/save-loyalty-config/saveLoyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import {
  loyaltyConfigWithMultipliers,
  multiplierPeriod1,
  multiplierPeriod2
} from '@utils/testData/loyaltyConfig'
import { createPinia, setActivePinia } from 'pinia'

describe('Save loyalty config', () => {
  let store: ReturnType<typeof useLoyaltyStore>
  let gateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLoyaltyStore()
    gateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('Update earning rate', () => {
    it('should update the config in the store', async () => {
      givenConfig(loyaltyConfigWithMultipliers)
      await whenSaveLoyaltyConfig(2.5)
      expect(store.config).toStrictEqual({
        earningRate: 2.5,
        multipliers: [multiplierPeriod1, multiplierPeriod2]
      })
    })
  })

  describe('Update earning rate with no multipliers', () => {
    it('should update the config in the store', async () => {
      await whenSaveLoyaltyConfig(5)
      expect(store.config).toStrictEqual({
        earningRate: 5,
        multipliers: []
      })
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = store.$subscribe((mutation: any, state: any) => {
        expect(state.isLoading).toBe(true)
        unsubscribe()
      })
      await whenSaveLoyaltyConfig(1)
    })

    it('should be aware that loading is over', async () => {
      await whenSaveLoyaltyConfig(1)
      expect(store.isLoading).toBe(false)
    })
  })

  const givenConfig = (config: LoyaltyConfig) => {
    gateway.feedWithConfig(config)
  }

  const whenSaveLoyaltyConfig = async (earningRate: number) => {
    await saveLoyaltyConfig(earningRate, gateway)
  }
})
