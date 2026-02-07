import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { CreateMultiplierRuleDTO } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { createMultiplierRule } from './createMultiplierRule'

describe('Create multiplier rule', () => {
  let loyaltyStore: any
  let loyaltyGateway: InMemoryLoyaltyGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
  })

  describe('For a new multiplier rule', () => {
    const dto: CreateMultiplierRuleDTO = {
      multiplier: 2,
      startDate: 1700000000000,
      endDate: 1700100000000
    }

    it('should add the rule to the store', async () => {
      uuidGenerator.setNext('rule-uuid-1')
      await whenCreateMultiplierRule(dto)
      expect(loyaltyStore.multiplierRules).toHaveLength(1)
    })

    it('should add the rule with correct multiplier to the store', async () => {
      uuidGenerator.setNext('rule-uuid-1')
      await whenCreateMultiplierRule(dto)
      expect(loyaltyStore.multiplierRules[0].multiplier).toBe(2)
    })

    it('should add the rule to the gateway', async () => {
      uuidGenerator.setNext('rule-uuid-1')
      await whenCreateMultiplierRule(dto)
      const rules = loyaltyGateway.getRules()
      expect(rules).toHaveLength(1)
    })
  })

  describe('For another multiplier rule', () => {
    const dto: CreateMultiplierRuleDTO = {
      multiplier: 3,
      startDate: 1700200000000,
      endDate: 1700300000000
    }

    it('should add the rule with correct multiplier to the store', async () => {
      uuidGenerator.setNext('rule-uuid-2')
      await whenCreateMultiplierRule(dto)
      expect(loyaltyStore.multiplierRules[0].multiplier).toBe(3)
    })
  })

  const whenCreateMultiplierRule = async (dto: CreateMultiplierRuleDTO) => {
    await createMultiplierRule(dto, loyaltyGateway)
  }
})
