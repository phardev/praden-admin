import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { MultiplierRule } from '@core/entities/loyalty/multiplierRule'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { deleteMultiplierRule } from './deleteMultiplierRule'

describe('Delete multiplier rule', () => {
  let loyaltyStore: any
  let loyaltyGateway: InMemoryLoyaltyGateway
  const uuidGenerator = new FakeUuidGenerator()

  const ruleA: MultiplierRule = {
    uuid: 'rule-1',
    multiplier: 2,
    startDate: 1700000000000,
    endDate: 1700100000000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }

  const ruleB: MultiplierRule = {
    uuid: 'rule-2',
    multiplier: 3,
    startDate: 1700200000000,
    endDate: 1700300000000,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  }

  const ruleC: MultiplierRule = {
    uuid: 'rule-3',
    multiplier: 1.5,
    startDate: 1700400000000,
    endDate: 1700500000000,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
  })

  describe('Given existing multiplier rules', () => {
    beforeEach(() => {
      givenExistingRules(ruleA, ruleB, ruleC)
    })

    it('should remove the first rule from the store', async () => {
      await whenDeleteMultiplierRule(ruleA.uuid)
      expect(loyaltyStore.multiplierRules).toStrictEqual([ruleB, ruleC])
    })

    it('should remove the first rule from the gateway', async () => {
      await whenDeleteMultiplierRule(ruleA.uuid)
      expect(loyaltyGateway.getRules()).toStrictEqual([ruleB, ruleC])
    })

    it('should remove the middle rule from the store', async () => {
      await whenDeleteMultiplierRule(ruleB.uuid)
      expect(loyaltyStore.multiplierRules).toStrictEqual([ruleA, ruleC])
    })

    it('should remove the last rule from the store', async () => {
      await whenDeleteMultiplierRule(ruleC.uuid)
      expect(loyaltyStore.multiplierRules).toStrictEqual([ruleA, ruleB])
    })
  })

  describe('For deleting a non-existing rule', () => {
    it('should throw an error', async () => {
      await expect(
        whenDeleteMultiplierRule('non-existing-uuid')
      ).rejects.toThrow()
    })
  })

  const givenExistingRules = (...rules: Array<MultiplierRule>) => {
    loyaltyGateway.feedWithRules(...rules)
    loyaltyStore.setMultiplierRules(rules)
  }

  const whenDeleteMultiplierRule = async (uuid: string) => {
    await deleteMultiplierRule(uuid, loyaltyGateway)
  }
})
