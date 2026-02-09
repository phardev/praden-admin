import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { CreateMultiplierDTO } from '@core/gateways/loyaltyGateway'
import { createMultiplier } from '@core/usecases/loyalty/create-multiplier/createMultiplier'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { doublePointsMultiplier } from '@utils/testData/loyalty'
import { createPinia, setActivePinia } from 'pinia'

describe('Create multiplier', () => {
  let loyaltyGateway: InMemoryLoyaltyGateway
  let loyaltyStore: any
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
    loyaltyStore = useLoyaltyStore()
  })

  describe('Create a new multiplier', () => {
    beforeEach(async () => {
      uuidGenerator.setNext('new-multiplier-uuid')
      await whenCreateMultiplier({
        startDate: '2024-06-01T00:00:00.000Z',
        endDate: '2024-06-30T23:59:59.000Z',
        multiplier: 2
      })
    })

    it('should add the multiplier to the store', () => {
      expect(loyaltyStore.multipliers).toStrictEqual([
        {
          uuid: 'new-multiplier-uuid',
          startDate: '2024-06-01T00:00:00.000Z',
          endDate: '2024-06-30T23:59:59.000Z',
          multiplier: 2,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ])
    })
  })

  describe('Create multiplier with existing ones', () => {
    beforeEach(async () => {
      loyaltyGateway.feedWithMultipliers(doublePointsMultiplier)
      loyaltyStore.multipliers = [doublePointsMultiplier]
      uuidGenerator.setNext('another-multiplier-uuid')
      await whenCreateMultiplier({
        startDate: '2024-12-01T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.000Z',
        multiplier: 3
      })
    })

    it('should add to existing multipliers in the store', () => {
      expect(loyaltyStore.multipliers).toStrictEqual([
        doublePointsMultiplier,
        {
          uuid: 'another-multiplier-uuid',
          startDate: '2024-12-01T00:00:00.000Z',
          endDate: '2024-12-31T23:59:59.000Z',
          multiplier: 3,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ])
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
      await whenCreateMultiplier({
        startDate: '2024-06-01T00:00:00.000Z',
        endDate: '2024-06-30T23:59:59.000Z',
        multiplier: 2
      })
    })

    it('should be aware that loading is over', async () => {
      await whenCreateMultiplier({
        startDate: '2024-06-01T00:00:00.000Z',
        endDate: '2024-06-30T23:59:59.000Z',
        multiplier: 2
      })
      expect(loyaltyStore.isLoading).toBe(false)
    })
  })

  const whenCreateMultiplier = async (dto: CreateMultiplierDTO) => {
    await createMultiplier(dto, loyaltyGateway)
  }
})
