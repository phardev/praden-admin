import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { SaveConfigDTO } from '@core/gateways/loyaltyGateway'
import { configureLoyalty } from '@core/usecases/loyalty/configure-loyalty/configureLoyalty'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { defaultLoyaltyConfig } from '@utils/testData/loyalty'
import { createPinia, setActivePinia } from 'pinia'

describe('Configure loyalty', () => {
  let loyaltyGateway: InMemoryLoyaltyGateway
  let loyaltyStore: any
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
    loyaltyStore = useLoyaltyStore()
  })

  describe('Save new config', () => {
    beforeEach(async () => {
      uuidGenerator.setNext('new-config-uuid')
      await whenConfigureLoyalty({ pointsPerEuro: 2 })
    })

    it('should store the saved config', () => {
      expect(loyaltyStore.config).toStrictEqual({
        uuid: 'new-config-uuid',
        pointsPerEuro: 2,
        updatedAt: '2024-01-01T00:00:00.000Z'
      })
    })
  })

  describe('Update existing config', () => {
    beforeEach(async () => {
      loyaltyGateway.feedWithConfig(defaultLoyaltyConfig)
      await whenConfigureLoyalty({ pointsPerEuro: 5 })
    })

    it('should store the updated config', () => {
      expect(loyaltyStore.config).toStrictEqual({
        uuid: defaultLoyaltyConfig.uuid,
        pointsPerEuro: 5,
        updatedAt: '2024-01-01T00:00:00.000Z'
      })
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
      await whenConfigureLoyalty({ pointsPerEuro: 1 })
    })

    it('should be aware that loading is over', async () => {
      await whenConfigureLoyalty({ pointsPerEuro: 1 })
      expect(loyaltyStore.isLoading).toBe(false)
    })
  })

  const whenConfigureLoyalty = async (dto: SaveConfigDTO) => {
    await configureLoyalty(dto, loyaltyGateway)
  }
})
