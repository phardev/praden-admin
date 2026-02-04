import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type {
  EditMultiplierDTO,
  LoyaltyPointsMultiplier
} from '@core/entities/loyalty'
import { editMultiplier } from '@core/usecases/loyalty/editMultiplier'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Edit multiplier', () => {
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

  describe('When editing a multiplier', () => {
    const updatedData: EditMultiplierDTO = {
      name: 'Triple Points Weekend',
      multiplierValue: 3,
      startDate: 1704499200000,
      endDate: 1704672000000
    }

    beforeEach(async () => {
      await whenEditMultiplier('mult-1', updatedData)
    })

    it('should update multiplier in gateway', async () => {
      const multipliers = await loyaltyGateway.listMultipliers()
      expect(multipliers[0].name).toBe('Triple Points Weekend')
    })

    it('should update multipliers in store', () => {
      expect(loyaltyStore.multipliers[0].name).toBe('Triple Points Weekend')
    })
  })

  const whenEditMultiplier = async (
    uuid: string,
    multiplier: EditMultiplierDTO
  ) => {
    await editMultiplier(uuid, multiplier, loyaltyGateway)
  }
})
