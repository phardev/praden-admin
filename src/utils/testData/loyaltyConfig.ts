import type {
  LoyaltyConfig,
  MultiplierPeriod
} from '@core/entities/loyaltyConfig'

export const multiplierPeriod1: MultiplierPeriod = {
  uuid: 'multiplier-1',
  startDate: 1700000000000,
  endDate: 1700604800000,
  multiplier: 2,
  createdAt: 1699900000000,
  createdBy: 'admin',
  updatedAt: 1699900000000,
  updatedBy: 'admin'
}

export const multiplierPeriod2: MultiplierPeriod = {
  uuid: 'multiplier-2',
  startDate: 1701000000000,
  endDate: 1701604800000,
  multiplier: 3,
  createdAt: 1700900000000,
  createdBy: 'admin',
  updatedAt: 1700900000000,
  updatedBy: 'admin'
}

export const loyaltyConfigWithMultipliers: LoyaltyConfig = {
  earningRate: 1,
  multipliers: [multiplierPeriod1, multiplierPeriod2]
}

export const loyaltyConfigEmpty: LoyaltyConfig = {
  earningRate: 1,
  multipliers: []
}
