import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyalty'
import { deleteMultiplier } from '@core/usecases/loyalty/deleteMultiplier'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Delete multiplier', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway
  const existingMultiplier: LoyaltyPointsMultiplier = {
    uuid: 'mult-1',
    name: 'Double Points Weekend',
    multiplierValue: 2,
    startDate: 1704499200000,
    endDate: 1704672000000,
    isActive: true,
    createdAt: 1704067200000
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
    loyaltyGateway.feedMultipliers(existingMultiplier)
    loyaltyStore.setMultipliers([existingMultiplier])
  })

  describe('When deleting a multiplier', () => {
    beforeEach(async () => {
      await whenDeleteMultiplier('mult-1')
    })

    it('should delete multiplier from gateway', async () => {
      const multipliers = await loyaltyGateway.listMultipliers()
      expect(multipliers.length).toBe(0)
    })

    it('should remove multiplier from store', () => {
      expect(loyaltyStore.multipliers.length).toBe(0)
    })
  })

  const whenDeleteMultiplier = async (uuid: string) => {
    await deleteMultiplier(uuid, loyaltyGateway)
  }
})
