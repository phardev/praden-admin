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
  loyaltyConfigVM,
  previewPoints
} from './loyaltyConfigVM'

describe('Loyalty config VM', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
  })

  describe('No config loaded', () => {
    it('should return empty VM when no config exists', () => {
      expect(loyaltyConfigVM()).toStrictEqual({
        earningRate: 0,
        multipliers: [],
        isLoading: false
      })
    })
  })

  describe('Config is loading', () => {
    it('should return isLoading true when store is loading', () => {
      loyaltyStore.startLoading()
      expect(loyaltyConfigVM().isLoading).toStrictEqual(true)
    })
  })

  describe('Config with no multipliers', () => {
    it('should return earning rate and empty multipliers', () => {
      givenConfig(loyaltyConfigEmpty)
      expect(loyaltyConfigVM()).toStrictEqual({
        earningRate: 1,
        multipliers: [],
        isLoading: false
      })
    })

    it('should return empty multipliers when multipliers is undefined', () => {
      loyaltyStore.setConfig({ earningRate: 1 } as LoyaltyConfig)
      expect(loyaltyConfigVM().multipliers).toStrictEqual([])
    })
  })

  describe('Config with multipliers', () => {
    beforeEach(() => {
      givenConfig(loyaltyConfigWithMultipliers)
    })

    it('should return the earning rate', () => {
      expect(loyaltyConfigVM().earningRate).toStrictEqual(1)
    })

    it('should return the correct number of multipliers', () => {
      expect(loyaltyConfigVM().multipliers.length).toStrictEqual(2)
    })

    it('should format first multiplier', () => {
      expect(loyaltyConfigVM().multipliers[0]).toStrictEqual({
        uuid: multiplierPeriod1.uuid,
        startDate: '14 nov. 2023',
        endDate: '21 nov. 2023',
        multiplier: 'x2',
        status: 'expired'
      })
    })

    it('should format second multiplier', () => {
      expect(loyaltyConfigVM().multipliers[1]).toStrictEqual({
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
      const now = Date.now()
      givenConfig({
        earningRate: 1,
        multipliers: [
          {
            ...multiplierPeriod1,
            startDate: now - 86400000,
            endDate: now + 86400000
          }
        ]
      })
      expect(loyaltyConfigVM().multipliers[0].status).toStrictEqual('active')
    })

    it('should return upcoming status for future period', () => {
      const now = Date.now()
      givenConfig({
        earningRate: 1,
        multipliers: [
          {
            ...multiplierPeriod1,
            startDate: now + 86400000,
            endDate: now + 172800000
          }
        ]
      })
      expect(loyaltyConfigVM().multipliers[0].status).toStrictEqual('upcoming')
    })
  })

  describe('Multiplier formatting', () => {
    it('should format decimal multiplier', () => {
      givenConfig({
        earningRate: 1,
        multipliers: [
          {
            ...multiplierPeriod1,
            multiplier: 1.5
          }
        ]
      })
      expect(loyaltyConfigVM().multipliers[0].multiplier).toStrictEqual('x1.5')
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
