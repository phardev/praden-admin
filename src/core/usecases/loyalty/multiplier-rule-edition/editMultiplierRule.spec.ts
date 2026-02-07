import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { MultiplierRule } from '@core/entities/loyalty/multiplierRule'
import type { EditMultiplierRuleDTO } from '@core/gateways/loyaltyGateway'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { editMultiplierRule } from './editMultiplierRule'

describe('Edit multiplier rule', () => {
  let loyaltyStore: any
  let loyaltyGateway: InMemoryLoyaltyGateway
  const uuidGenerator = new FakeUuidGenerator()

  const existingRule: MultiplierRule = {
    uuid: 'rule-1',
    multiplier: 2,
    startDate: 1700000000000,
    endDate: 1700100000000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }

  const anotherRule: MultiplierRule = {
    uuid: 'rule-2',
    multiplier: 3,
    startDate: 1700200000000,
    endDate: 1700300000000,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
  })

  describe('Given existing multiplier rules', () => {
    beforeEach(() => {
      givenExistingRules(existingRule, anotherRule)
    })

    describe('For editing the first rule', () => {
      const dto: EditMultiplierRuleDTO = {
        multiplier: 5,
        startDate: 1700000000000,
        endDate: 1700150000000
      }

      it('should update the rule multiplier in the store', async () => {
        await whenEditMultiplierRule(existingRule.uuid, dto)
        expect(loyaltyStore.multiplierRules[0].multiplier).toBe(5)
      })

      it('should update the rule endDate in the store', async () => {
        await whenEditMultiplierRule(existingRule.uuid, dto)
        expect(loyaltyStore.multiplierRules[0].endDate).toBe(1700150000000)
      })

      it('should not modify the other rule in the store', async () => {
        await whenEditMultiplierRule(existingRule.uuid, dto)
        expect(loyaltyStore.multiplierRules[1]).toStrictEqual(anotherRule)
      })

      it('should update the rule in the gateway', async () => {
        await whenEditMultiplierRule(existingRule.uuid, dto)
        const rules = loyaltyGateway.getRules()
        expect(rules[0].multiplier).toBe(5)
      })
    })
  })

  const givenExistingRules = (...rules: Array<MultiplierRule>) => {
    loyaltyGateway.feedWithRules(...rules)
    loyaltyStore.setMultiplierRules(rules)
  }

  const whenEditMultiplierRule = async (
    uuid: string,
    dto: EditMultiplierRuleDTO
  ) => {
    await editMultiplierRule(uuid, dto, loyaltyGateway)
  }
})
