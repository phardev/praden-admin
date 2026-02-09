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
import { loyaltyConfigVM } from './loyaltyConfigVM'

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
