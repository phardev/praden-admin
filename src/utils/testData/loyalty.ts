import type { LoyaltyPointsConfig } from '@core/entities/loyaltyPointsConfig'
import type { LoyaltyPointsMultiplier } from '@core/entities/loyaltyPointsMultiplier'
import type { LoyaltyPointsTransaction } from '@core/entities/loyaltyPointsTransaction'

export const defaultLoyaltyConfig: LoyaltyPointsConfig = {
  uuid: 'loyalty-config-uuid',
  pointsPerEuro: 1,
  updatedAt: '2024-01-01T00:00:00.000Z'
}

export const doublePointsMultiplier: LoyaltyPointsMultiplier = {
  uuid: 'double-points-multiplier-uuid',
  startDate: '2024-06-01T00:00:00.000Z',
  endDate: '2024-06-30T23:59:59.000Z',
  multiplier: 2,
  createdAt: '2024-01-01T00:00:00.000Z'
}

export const triplePointsMultiplier: LoyaltyPointsMultiplier = {
  uuid: 'triple-points-multiplier-uuid',
  startDate: '2024-12-01T00:00:00.000Z',
  endDate: '2024-12-31T23:59:59.000Z',
  multiplier: 3,
  createdAt: '2024-01-01T00:00:00.000Z'
}

export const earnedTransaction: LoyaltyPointsTransaction = {
  uuid: 'earned-transaction-uuid',
  type: 'EARNED',
  points: 50,
  orderUuid: 'order-uuid-1',
  purchaseDate: '2024-03-15T10:00:00.000Z',
  expiresAt: '2025-03-15T10:00:00.000Z',
  createdAt: '2024-03-15T10:00:00.000Z'
}

export const manualCreditTransaction: LoyaltyPointsTransaction = {
  uuid: 'manual-credit-transaction-uuid',
  type: 'MANUAL_CREDIT',
  points: 100,
  reason: 'Customer loyalty reward',
  createdAt: '2024-04-01T00:00:00.000Z'
}
