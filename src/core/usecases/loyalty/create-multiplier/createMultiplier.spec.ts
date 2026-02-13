import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import { createMultiplier } from '@core/usecases/loyalty/create-multiplier/createMultiplier'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { loyaltyConfigWithMultipliers } from '@utils/testData/loyaltyConfig'
import { createPinia, setActivePinia } from 'pinia'

describe('Create multiplier', () => {
  let store: ReturnType<typeof useLoyaltyStore>
  let gateway: InMemoryLoyaltyGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLoyaltyStore()
    gateway = new InMemoryLoyaltyGateway(uuidGenerator)
  })

  describe('Add a multiplier to existing config', () => {
    beforeEach(async () => {
      givenConfig(loyaltyConfigWithMultipliers)
      givenStoreHasConfig(loyaltyConfigWithMultipliers)
      uuidGenerator.setNext('new-multiplier-uuid')
      await whenCreateMultiplier(1702000000000, 1702604800000, 4)
    })

    it('should add the multiplier to the store config', () => {
      expect(store.config!.multipliers).toHaveLength(3)
    })

    it('should set correct multiplier value', () => {
      const lastMultiplier =
        store.config!.multipliers[store.config!.multipliers.length - 1]
      expect(lastMultiplier.multiplier).toBe(4)
    })

    it('should set correct start date', () => {
      const lastMultiplier =
        store.config!.multipliers[store.config!.multipliers.length - 1]
      expect(lastMultiplier.startDate).toBe(1702000000000)
    })

    it('should set correct end date', () => {
      const lastMultiplier =
        store.config!.multipliers[store.config!.multipliers.length - 1]
      expect(lastMultiplier.endDate).toBe(1702604800000)
    })
  })

  const givenConfig = (config: LoyaltyConfig) => {
    gateway.feedWithConfig(config)
  }

  const givenStoreHasConfig = (config: LoyaltyConfig) => {
    store.setConfig(JSON.parse(JSON.stringify(config)))
  }

  const whenCreateMultiplier = async (
    startDate: number,
    endDate: number,
    multiplier: number
  ) => {
    await createMultiplier(startDate, endDate, multiplier, gateway)
  }
})
