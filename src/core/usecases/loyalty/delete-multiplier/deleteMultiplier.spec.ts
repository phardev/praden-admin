import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyaltyPointsMultiplier'
import type { UUID } from '@core/types/types'
import { deleteMultiplier } from '@core/usecases/loyalty/delete-multiplier/deleteMultiplier'
import { useLoyaltyStore } from '@store/loyaltyStore'
import {
  doublePointsMultiplier,
  triplePointsMultiplier
} from '@utils/testData/loyalty'
import { createPinia, setActivePinia } from 'pinia'

describe('Delete multiplier', () => {
  let loyaltyGateway: InMemoryLoyaltyGateway
  let loyaltyStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
    loyaltyStore = useLoyaltyStore()
  })

  describe('Delete existing multiplier', () => {
    beforeEach(async () => {
      givenExistingMultipliers(doublePointsMultiplier, triplePointsMultiplier)
      await whenDeleteMultiplier(doublePointsMultiplier.uuid)
    })

    it('should remove the multiplier from the store', () => {
      expect(loyaltyStore.multipliers).toStrictEqual([triplePointsMultiplier])
    })

    it('should remove the multiplier from the gateway', async () => {
      expect(loyaltyGateway.getStoredMultipliers()).toStrictEqual([
        triplePointsMultiplier
      ])
    })
  })

  describe('Delete another multiplier', () => {
    beforeEach(async () => {
      givenExistingMultipliers(doublePointsMultiplier, triplePointsMultiplier)
      await whenDeleteMultiplier(triplePointsMultiplier.uuid)
    })

    it('should remove only the targeted multiplier from the store', () => {
      expect(loyaltyStore.multipliers).toStrictEqual([doublePointsMultiplier])
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
      await whenDeleteMultiplier('some-uuid')
    })

    it('should be aware that loading is over', async () => {
      await whenDeleteMultiplier('some-uuid')
      expect(loyaltyStore.isLoading).toBe(false)
    })
  })

  const givenExistingMultipliers = (
    ...multipliers: Array<LoyaltyPointsMultiplier>
  ) => {
    loyaltyGateway.feedWithMultipliers(...multipliers)
    loyaltyStore.multipliers = JSON.parse(JSON.stringify(multipliers))
  }

  const whenDeleteMultiplier = async (uuid: UUID) => {
    await deleteMultiplier(uuid, loyaltyGateway)
  }
})
