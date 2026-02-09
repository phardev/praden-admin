import type { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyaltyPointsMultiplier'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  getLoyaltyConfigVM,
  type LoyaltyConfigVM,
  type MultiplierItemVM
} from './loyaltyConfigVM'

const config: LoyaltyPointsConfig = {
  uuid: 'config-uuid-1',
  pointsPerEuro: 2,
  updatedAt: '2024-06-01T10:00:00.000Z'
}

const activeMultiplier: LoyaltyPointsMultiplier = {
  uuid: 'multiplier-uuid-1',
  startDate: '2024-12-01T00:00:00.000Z',
  endDate: '2024-12-31T23:59:59.000Z',
  multiplier: 3,
  createdAt: '2024-11-15T10:00:00.000Z'
}

const anotherMultiplier: LoyaltyPointsMultiplier = {
  uuid: 'multiplier-uuid-2',
  startDate: '2025-01-01T00:00:00.000Z',
  endDate: '2025-01-31T23:59:59.000Z',
  multiplier: 1.5,
  createdAt: '2024-12-20T08:00:00.000Z'
}

describe('loyaltyConfigVM', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
  })

  it('should return null config when no config exists', () => {
    const result = getLoyaltyConfigVM()

    expect(result.pointsPerEuro).toStrictEqual(null)
  })

  it('should return config pointsPerEuro from store', () => {
    loyaltyStore.setConfig(config)

    const result = getLoyaltyConfigVM()

    expect(result.pointsPerEuro).toStrictEqual(2)
  })

  it('should return empty multipliers when none exist', () => {
    const result = getLoyaltyConfigVM()

    expect(result.multipliers).toStrictEqual([])
  })

  it('should format multiplier dates with French locale', () => {
    loyaltyStore.setMultipliers([activeMultiplier])

    const result = getLoyaltyConfigVM()

    expect(result.multipliers[0].startDate).toStrictEqual('01/12/2024')
  })

  it('should format multiplier end date with French locale', () => {
    loyaltyStore.setMultipliers([activeMultiplier])

    const result = getLoyaltyConfigVM()

    expect(result.multipliers[0].endDate).toStrictEqual('31/12/2024')
  })

  it('should return all multiplier fields correctly', () => {
    loyaltyStore.setConfig(config)
    loyaltyStore.setMultipliers([activeMultiplier, anotherMultiplier])

    const result = getLoyaltyConfigVM()

    expect(result).toStrictEqual({
      pointsPerEuro: 2,
      multipliers: [
        {
          uuid: 'multiplier-uuid-1',
          startDate: '01/12/2024',
          endDate: '31/12/2024',
          multiplier: 3,
          createdAt: '15/11/2024'
        },
        {
          uuid: 'multiplier-uuid-2',
          startDate: '01/01/2025',
          endDate: '31/01/2025',
          multiplier: 1.5,
          createdAt: '20/12/2024'
        }
      ],
      isLoading: false
    } satisfies LoyaltyConfigVM)
  })

  it('should reflect loading state from store', () => {
    loyaltyStore.startLoading()

    const result = getLoyaltyConfigVM()

    expect(result.isLoading).toStrictEqual(true)
  })
})
