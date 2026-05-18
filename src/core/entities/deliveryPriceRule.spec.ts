import { describe, expect, it } from 'vitest'
import {
  computeDeliveryPriceRuleStatus,
  type DeliveryPriceRule
} from './deliveryPriceRule'

const baseRule: DeliveryPriceRule = {
  uuid: 'rule-1',
  deliveryMethodUuid: 'delivery-method-1',
  name: 'Rule',
  price: 0,
  minOrderValue: 0,
  maxWeight: 30000,
  priority: 0,
  startDate: null,
  endDate: null,
  isActive: true,
  createdAt: 1700000000000,
  createdBy: 'admin@example.com',
  updatedAt: 1700000000000,
  updatedBy: 'admin@example.com'
}

const now = 1_703_500_000_000

describe('computeDeliveryPriceRuleStatus', () => {
  it('should return disabled when rule is not active', () => {
    const rule = { ...baseRule, isActive: false }

    expect(computeDeliveryPriceRuleStatus(rule, now)).toStrictEqual('disabled')
  })

  it('should return disabled when not active even with dates in the future', () => {
    const rule = {
      ...baseRule,
      isActive: false,
      startDate: now + 1,
      endDate: now + 2
    }

    expect(computeDeliveryPriceRuleStatus(rule, now)).toStrictEqual('disabled')
  })

  it('should return upcoming when active and start date is in the future', () => {
    const rule = { ...baseRule, startDate: now + 1 }

    expect(computeDeliveryPriceRuleStatus(rule, now)).toStrictEqual('upcoming')
  })

  it('should return expired when active and end date is reached', () => {
    const rule = { ...baseRule, endDate: now }

    expect(computeDeliveryPriceRuleStatus(rule, now)).toStrictEqual('expired')
  })

  it('should return expired when active and end date is in the past', () => {
    const rule = { ...baseRule, endDate: now - 1 }

    expect(computeDeliveryPriceRuleStatus(rule, now)).toStrictEqual('expired')
  })

  it('should return active when active and no dates set', () => {
    expect(computeDeliveryPriceRuleStatus(baseRule, now)).toStrictEqual(
      'active'
    )
  })

  it('should return active when within date range', () => {
    const rule = { ...baseRule, startDate: now - 1, endDate: now + 1 }

    expect(computeDeliveryPriceRuleStatus(rule, now)).toStrictEqual('active')
  })

  it('should return active when start date is reached exactly', () => {
    const rule = { ...baseRule, startDate: now }

    expect(computeDeliveryPriceRuleStatus(rule, now)).toStrictEqual('active')
  })
})
