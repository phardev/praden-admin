import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyaltyPointsMultiplier'
import { getMultipliers } from '@core/usecases/loyalty/get-multipliers/getMultipliers'
import { useLoyaltyStore } from '@store/loyaltyStore'
import {
  doublePointsMultiplier,
  triplePointsMultiplier
} from '@utils/testData/loyalty'
import { createPinia, setActivePinia } from 'pinia'

describe('Get multipliers', () => {
  let loyaltyGateway: InMemoryLoyaltyGateway
  let loyaltyStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
    loyaltyStore = useLoyaltyStore()
  })

  describe('There are some multipliers', () => {
    beforeEach(async () => {
      givenExistingMultipliers(doublePointsMultiplier, triplePointsMultiplier)
      await whenGetMultipliers()
    })

    it('should store all multipliers', () => {
      expect(loyaltyStore.multipliers).toStrictEqual([
        doublePointsMultiplier,
        triplePointsMultiplier
      ])
    })
  })

  describe('There are no multipliers', () => {
    beforeEach(async () => {
      await whenGetMultipliers()
    })

    it('should store an empty list', () => {
      expect(loyaltyStore.multipliers).toStrictEqual([])
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
      await whenGetMultipliers()
    })

    it('should be aware that loading is over', async () => {
      await whenGetMultipliers()
      expect(loyaltyStore.isLoading).toBe(false)
    })
  })

  const givenExistingMultipliers = (
    ...multipliers: Array<LoyaltyPointsMultiplier>
  ) => {
    loyaltyGateway.feedWithMultipliers(...multipliers)
  }

  const whenGetMultipliers = async () => {
    await getMultipliers(loyaltyGateway)
  }
})
