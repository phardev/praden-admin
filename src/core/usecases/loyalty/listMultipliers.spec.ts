import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyalty'
import { listMultipliers } from '@core/usecases/loyalty/listMultipliers'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('List multipliers', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('When there are no multipliers', () => {
    it('should set empty array in store', async () => {
      await whenListMultipliers()
      expect(loyaltyStore.multipliers).toStrictEqual([])
    })
  })

  describe('When there are multipliers', () => {
    const existingMultipliers: LoyaltyPointsMultiplier[] = [
      {
        uuid: 'mult-1',
        name: 'Double Points Weekend',
        multiplierValue: 2,
        startDate: 1704499200000,
        endDate: 1704672000000,
        isActive: true,
        createdAt: 1704067200000
      }
    ]

    beforeEach(() => {
      givenExistingMultipliers(existingMultipliers)
    })

    it('should set multipliers in store', async () => {
      await whenListMultipliers()
      expect(loyaltyStore.multipliers).toStrictEqual(existingMultipliers)
    })
  })

  const givenExistingMultipliers = (multipliers: LoyaltyPointsMultiplier[]) => {
    loyaltyGateway.feedMultipliers(...multipliers)
  }

  const whenListMultipliers = async () => {
    await listMultipliers(loyaltyGateway)
  }
})
