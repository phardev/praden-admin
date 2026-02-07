import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { LoyaltyConfig } from '@core/entities/loyalty/loyaltyConfig'
import type { MultiplierRule } from '@core/entities/loyalty/multiplierRule'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { getLoyaltyConfig } from './getLoyaltyConfig'

describe('Get loyalty config', () => {
  let loyaltyStore: any
  let loyaltyGateway: InMemoryLoyaltyGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
  })

  describe('Given a loyalty config with no rules', () => {
    const config: LoyaltyConfig = { pointsPerEuro: 0.1 }

    beforeEach(() => {
      loyaltyGateway.feedWithConfig(config)
    })

    it('should set the config in the store', async () => {
      await whenGetLoyaltyConfig()
      expect(loyaltyStore.config).toStrictEqual(config)
    })

    it('should set empty rules in the store', async () => {
      await whenGetLoyaltyConfig()
      expect(loyaltyStore.multiplierRules).toStrictEqual([])
    })
  })

  describe('Given a loyalty config with multiplier rules', () => {
    const config: LoyaltyConfig = { pointsPerEuro: 0.5 }
    const rules: Array<MultiplierRule> = [
      {
        uuid: 'rule-1',
        multiplier: 2,
        startDate: 1700000000000,
        endDate: 1700100000000,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        uuid: 'rule-2',
        multiplier: 3,
        startDate: 1700200000000,
        endDate: 1700300000000,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z'
      }
    ]

    beforeEach(() => {
      loyaltyGateway.feedWithConfig(config)
      loyaltyGateway.feedWithRules(...rules)
    })

    it('should set the config in the store', async () => {
      await whenGetLoyaltyConfig()
      expect(loyaltyStore.config).toStrictEqual(config)
    })

    it('should set the rules in the store', async () => {
      await whenGetLoyaltyConfig()
      expect(loyaltyStore.multiplierRules).toStrictEqual(rules)
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      let isLoadingDuringOperation = false
      const unsubscribe = loyaltyStore.$subscribe(
        (_mutation: any, state: any) => {
          if (state.isLoading) {
            isLoadingDuringOperation = true
          }
          unsubscribe()
        }
      )
      await whenGetLoyaltyConfig()
      expect(isLoadingDuringOperation).toBe(true)
    })

    it('should be aware when loading is done', async () => {
      await whenGetLoyaltyConfig()
      expect(loyaltyStore.isLoading).toBe(false)
    })
  })

  const whenGetLoyaltyConfig = async () => {
    await getLoyaltyConfig(loyaltyGateway)
  }
})
