import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { getMultipliersListVM } from './multipliersListVM'

describe('multipliersListVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should return empty array when no multipliers', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([])

    const result = getMultipliersListVM()

    expect(result).toStrictEqual([])
  })

  it('should return multiplier uuid', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([
      {
        uuid: 'mult-1',
        name: 'Double points été',
        multiplierValue: 2,
        startDate: 1717200000000,
        endDate: 1725148799000,
        isActive: true,
        createdAt: 1704067200000
      }
    ])

    const result = getMultipliersListVM()

    expect(result[0].uuid).toStrictEqual('mult-1')
  })

  it('should return multiplier name', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([
      {
        uuid: 'mult-1',
        name: 'Double points été',
        multiplierValue: 2,
        startDate: 1717200000000,
        endDate: 1725148799000,
        isActive: true,
        createdAt: 1704067200000
      }
    ])

    const result = getMultipliersListVM()

    expect(result[0].name).toStrictEqual('Double points été')
  })

  it('should format multiplier value with x suffix', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([
      {
        uuid: 'mult-1',
        name: 'Double points été',
        multiplierValue: 2,
        startDate: 1717200000000,
        endDate: 1725148799000,
        isActive: true,
        createdAt: 1704067200000
      }
    ])

    const result = getMultipliersListVM()

    expect(result[0].formattedMultiplierValue).toStrictEqual('x2')
  })

  it('should format start date', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([
      {
        uuid: 'mult-1',
        name: 'Double points été',
        multiplierValue: 2,
        startDate: 1717200000000,
        endDate: 1725148799000,
        isActive: true,
        createdAt: 1704067200000
      }
    ])

    const result = getMultipliersListVM()

    expect(result[0].formattedStartDate).toStrictEqual('1 juin 2024')
  })

  it('should format end date', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([
      {
        uuid: 'mult-1',
        name: 'Double points été',
        multiplierValue: 2,
        startDate: 1717200000000,
        endDate: 1725148799000,
        isActive: true,
        createdAt: 1704067200000
      }
    ])

    const result = getMultipliersListVM()

    expect(result[0].formattedEndDate).toStrictEqual('31 août 2024')
  })

  it('should return isActive status', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([
      {
        uuid: 'mult-1',
        name: 'Double points été',
        multiplierValue: 2,
        startDate: 1717200000000,
        endDate: 1725148799000,
        isActive: true,
        createdAt: 1704067200000
      }
    ])

    const result = getMultipliersListVM()

    expect(result[0].isActive).toStrictEqual(true)
  })

  it('should sort multipliers by start date descending', () => {
    const store = useLoyaltyStore()
    store.setMultipliers([
      {
        uuid: 'mult-1',
        name: 'First',
        multiplierValue: 2,
        startDate: 1704067200000,
        endDate: 1706745599000,
        isActive: false,
        createdAt: 1704067200000
      },
      {
        uuid: 'mult-2',
        name: 'Second',
        multiplierValue: 3,
        startDate: 1717200000000,
        endDate: 1719791999000,
        isActive: true,
        createdAt: 1704067200000
      }
    ])

    const result = getMultipliersListVM()

    expect(result.map((m) => m.uuid)).toStrictEqual(['mult-2', 'mult-1'])
  })
})
