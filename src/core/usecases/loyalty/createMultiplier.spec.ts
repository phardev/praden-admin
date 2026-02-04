import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { CreateMultiplierDTO } from '@core/entities/loyalty'
import { createMultiplier } from '@core/usecases/loyalty/createMultiplier'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Create multiplier', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('When creating a multiplier', () => {
    const newMultiplier: CreateMultiplierDTO = {
      name: 'Double Points Weekend',
      multiplierValue: 2,
      startDate: 1704499200000,
      endDate: 1704672000000
    }

    beforeEach(async () => {
      await whenCreateMultiplier(newMultiplier)
    })

    it('should create multiplier in gateway', async () => {
      const multipliers = await loyaltyGateway.listMultipliers()
      expect(multipliers.length).toBe(1)
    })

    it('should update multipliers in store', () => {
      expect(loyaltyStore.multipliers.length).toBe(1)
    })
  })

  const whenCreateMultiplier = async (multiplier: CreateMultiplierDTO) => {
    await createMultiplier(multiplier, loyaltyGateway)
  }
})
