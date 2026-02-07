import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  type GetLoyaltyConfigVM,
  getLoyaltyConfigVM
} from './getLoyaltyConfigVM'

describe('getLoyaltyConfigVM', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let vm: GetLoyaltyConfigVM | null

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
  })

  it('should return null when config is not loaded', () => {
    whenGetLoyaltyConfigVM()

    expect(vm).toStrictEqual(null)
  })

  it('should return pointsPerEuro from config', () => {
    givenConfig({ pointsPerEuro: 10 })

    whenGetLoyaltyConfigVM()

    expect(vm!.pointsPerEuro).toStrictEqual(10)
  })

  it('should return empty multiplier rules when none exist', () => {
    givenConfig({ pointsPerEuro: 10 })

    whenGetLoyaltyConfigVM()

    expect(vm!.multiplierRules).toStrictEqual([])
  })

  it('should return multiplier rules with formatted dates', () => {
    givenConfig({ pointsPerEuro: 10 })
    givenMultiplierRules([
      {
        uuid: 'rule-1',
        multiplier: 2,
        startDate: 1703116800000,
        endDate: 1703980800000,
        createdAt: '2023-12-21T00:00:00.000Z',
        updatedAt: '2023-12-21T00:00:00.000Z'
      }
    ])

    whenGetLoyaltyConfigVM()

    expect(vm!.multiplierRules).toStrictEqual([
      {
        uuid: 'rule-1',
        multiplier: 2,
        startDate: 1703116800000,
        endDate: 1703980800000,
        formattedStartDate: '21 déc. 2023',
        formattedEndDate: '31 déc. 2023'
      }
    ])
  })

  it('should return isLoading from store', () => {
    givenConfig({ pointsPerEuro: 10 })
    loyaltyStore.startLoading()

    whenGetLoyaltyConfigVM()

    expect(vm!.isLoading).toStrictEqual(true)
  })

  it('should return isLoading false by default', () => {
    givenConfig({ pointsPerEuro: 10 })

    whenGetLoyaltyConfigVM()

    expect(vm!.isLoading).toStrictEqual(false)
  })

  const givenConfig = (config: { pointsPerEuro: number }) => {
    loyaltyStore.setConfig(config)
  }

  const givenMultiplierRules = (
    rules: Array<{
      uuid: string
      multiplier: number
      startDate: number
      endDate: number
      createdAt: string
      updatedAt: string
    }>
  ) => {
    loyaltyStore.setMultiplierRules(rules)
  }

  const whenGetLoyaltyConfigVM = () => {
    vm = getLoyaltyConfigVM()
  }
})
