import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import type { LoyaltyConfig } from '@core/entities/loyaltyConfig'
import { useLoyaltyStore } from '@store/loyaltyStore'
import {
  loyaltyConfigEmpty,
  loyaltyConfigWithMultipliers,
  multiplierPeriod1,
  multiplierPeriod2
} from '@utils/testData/loyaltyConfig'
import { createPinia, setActivePinia } from 'pinia'
import type { LoyaltyConfigVM } from './loyaltyConfigVM'
import {
  earningRateToForm,
  formToEarningRate,
  formToRedemptionRate,
  loyaltyConfigVM,
  previewPoints,
  previewReduction,
  redemptionRateToForm
} from './loyaltyConfigVM'

describe('Loyalty config VM', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    dateProvider = new FakeDateProvider()
    dateProvider.feedWith(1702000000000)
  })

  describe('No config loaded', () => {
    it('should return empty VM when no config exists', () => {
      expect(loyaltyConfigVM(dateProvider)).toStrictEqual({
        earningRate: 0,
        redemptionRate: 0,
        multipliers: [],
        isLoading: false
      })
    })
  })

  describe('Config is loading', () => {
    it('should return isLoading true when store is loading', () => {
      loyaltyStore.startLoading()
      expect(loyaltyConfigVM(dateProvider).isLoading).toStrictEqual(true)
    })
  })

  describe('Config with no multipliers', () => {
    it('should return earning rate and empty multipliers', () => {
      givenConfig(loyaltyConfigEmpty)
      expect(loyaltyConfigVM(dateProvider)).toStrictEqual({
        earningRate: 1,
        redemptionRate: 0.01,
        multipliers: [],
        isLoading: false
      })
    })

    it('should return empty multipliers when multipliers is undefined', () => {
      loyaltyStore.setConfig({ earningRate: 1 } as LoyaltyConfig)
      expect(loyaltyConfigVM(dateProvider).multipliers).toStrictEqual([])
    })
  })

  describe('Config with multipliers', () => {
    beforeEach(() => {
      givenConfig(loyaltyConfigWithMultipliers)
    })

    it('should return the earning rate', () => {
      expect(loyaltyConfigVM(dateProvider).earningRate).toStrictEqual(1)
    })

    it('should return the correct number of multipliers', () => {
      expect(loyaltyConfigVM(dateProvider).multipliers.length).toStrictEqual(2)
    })

    it('should format first multiplier', () => {
      expect(loyaltyConfigVM(dateProvider).multipliers[0]).toStrictEqual({
        uuid: multiplierPeriod1.uuid,
        startDate: '14 nov. 2023',
        endDate: '21 nov. 2023',
        multiplier: 'x2',
        status: 'expired'
      })
    })

    it('should format second multiplier', () => {
      expect(loyaltyConfigVM(dateProvider).multipliers[1]).toStrictEqual({
        uuid: multiplierPeriod2.uuid,
        startDate: '26 nov. 2023',
        endDate: '3 déc. 2023',
        multiplier: 'x3',
        status: 'expired'
      })
    })
  })

  describe('Multiplier status', () => {
    it('should return active status for current period', () => {
      dateProvider.feedWith(1700000000000)
      givenConfig({
        earningRate: 1,
        redemptionRate: 0.01,
        multipliers: [
          {
            ...multiplierPeriod1,
            startDate: 1699900000000,
            endDate: 1700100000000
          }
        ]
      })
      expect(loyaltyConfigVM(dateProvider).multipliers[0].status).toStrictEqual(
        'active'
      )
    })

    it('should return upcoming status for future period', () => {
      dateProvider.feedWith(1700000000000)
      givenConfig({
        earningRate: 1,
        redemptionRate: 0.01,
        multipliers: [
          {
            ...multiplierPeriod1,
            startDate: 1700100000000,
            endDate: 1700200000000
          }
        ]
      })
      expect(loyaltyConfigVM(dateProvider).multipliers[0].status).toStrictEqual(
        'upcoming'
      )
    })
  })

  describe('Multiplier formatting', () => {
    it('should format decimal multiplier', () => {
      givenConfig({
        earningRate: 1,
        redemptionRate: 0.01,
        multipliers: [
          {
            ...multiplierPeriod1,
            multiplier: 1.5
          }
        ]
      })
      expect(
        loyaltyConfigVM(dateProvider).multipliers[0].multiplier
      ).toStrictEqual('x1.5')
    })
  })

  const givenConfig = (config: LoyaltyConfig) => {
    loyaltyStore.setConfig(config)
  }
})

describe('earningRateToForm', () => {
  it('should convert 0.001 to 1 point per 10 euros', () => {
    expect(earningRateToForm(0.001)).toStrictEqual({ points: 1, euros: 10 })
  })

  it('should convert 0.01 to 1 point per 1 euro', () => {
    expect(earningRateToForm(0.01)).toStrictEqual({ points: 1, euros: 1 })
  })
})

describe('formToEarningRate', () => {
  it('should convert 1 point per 10 euros to 0.001', () => {
    expect(formToEarningRate(1, 10)).toStrictEqual(0.001)
  })

  it('should convert 1 point per 1 euro to 0.01', () => {
    expect(formToEarningRate(1, 1)).toStrictEqual(0.01)
  })
})

describe('previewPoints', () => {
  it('should floor 25 euros at 0.001 rate to 2 points', () => {
    expect(previewPoints(25, 0.001)).toStrictEqual(2)
  })

  it('should floor 9.99 euros at 0.001 rate to 0 points', () => {
    expect(previewPoints(9.99, 0.001)).toStrictEqual(0)
  })

  it('should calculate 50 euros at 0.001 rate to 5 points', () => {
    expect(previewPoints(50, 0.001)).toStrictEqual(5)
  })
})

describe('redemptionRateToForm', () => {
  it('should convert 0.05 to 1 point for 0.05 euros', () => {
    expect(redemptionRateToForm(0.05)).toStrictEqual({ points: 1, euros: 0.05 })
  })

  it('should convert 0.01 to 1 point for 0.01 euros', () => {
    expect(redemptionRateToForm(0.01)).toStrictEqual({ points: 1, euros: 0.01 })
  })
})

describe('formToRedemptionRate', () => {
  it('should convert 1 point for 0.05 euros to 0.05', () => {
    expect(formToRedemptionRate(1, 0.05)).toStrictEqual(0.05)
  })

  it('should convert 1 point for 0.01 euros to 0.01', () => {
    expect(formToRedemptionRate(1, 0.01)).toStrictEqual(0.01)
  })
})

describe('previewReduction', () => {
  it('should calculate 100 points at 0.05 rate to 5 euros', () => {
    expect(previewReduction(100, 0.05)).toStrictEqual(5)
  })

  it('should calculate 50 points at 0.05 rate to 2.5 euros', () => {
    expect(previewReduction(50, 0.05)).toStrictEqual(2.5)
  })

  it('should calculate 200 points at 0.01 rate to 2 euros', () => {
    expect(previewReduction(200, 0.01)).toStrictEqual(2)
  })
})
