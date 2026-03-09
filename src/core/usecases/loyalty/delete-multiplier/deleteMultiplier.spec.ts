import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import { deleteMultiplier } from '@core/usecases/loyalty/delete-multiplier/deleteMultiplier'
import { useLoyaltyStore } from '@store/loyaltyStore'
import {
  loyaltyConfigWithMultipliers,
  multiplierPeriod1,
  multiplierPeriod2
} from '@utils/testData/loyaltyConfig'
import { createPinia, setActivePinia } from 'pinia'

describe('Delete multiplier', () => {
  let store: ReturnType<typeof useLoyaltyStore>
  let gateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLoyaltyStore()
    gateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('Delete first multiplier', () => {
    beforeEach(async () => {
      givenConfig(loyaltyConfigWithMultipliers)
      givenStoreHasConfig(loyaltyConfigWithMultipliers)
      await whenDeleteMultiplier(multiplierPeriod1.uuid)
    })

    it('should remove the multiplier from the store', () => {
      expect(store.config!.multipliers).toStrictEqual([multiplierPeriod2])
    })
  })

  describe('Delete second multiplier', () => {
    beforeEach(async () => {
      givenConfig(loyaltyConfigWithMultipliers)
      givenStoreHasConfig(loyaltyConfigWithMultipliers)
      await whenDeleteMultiplier(multiplierPeriod2.uuid)
    })

    it('should remove the multiplier from the store', () => {
      expect(store.config!.multipliers).toStrictEqual([multiplierPeriod1])
    })
  })

  describe('Delete non-existing multiplier', () => {
    beforeEach(() => {
      givenConfig(loyaltyConfigWithMultipliers)
      givenStoreHasConfig(loyaltyConfigWithMultipliers)
    })

    it('should throw an error', async () => {
      await expect(whenDeleteMultiplier('not-exists')).rejects.toThrow()
    })
  })

  const givenConfig = (config: LoyaltyConfig) => {
    gateway.feedWithConfig(config)
  }

  const givenStoreHasConfig = (config: LoyaltyConfig) => {
    store.setConfig(JSON.parse(JSON.stringify(config)))
  }

  const whenDeleteMultiplier = async (uuid: string) => {
    await deleteMultiplier(uuid, gateway)
  }
})
