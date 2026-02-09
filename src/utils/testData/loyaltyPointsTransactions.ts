import type {
  CustomerLoyalty,
  LoyaltyPointsTransaction
} from '@core/entities/loyaltyPointsTransaction'
import { LoyaltyTransactionType } from '@core/entities/loyaltyPointsTransaction'

export const earnedTransaction: LoyaltyPointsTransaction = {
  uuid: 'loyalty-tx-earned-1',
  customerUuid: 'customer-1',
  type: LoyaltyTransactionType.Earned,
  points: 50,
  orderUuid: 'order-1',
  earnedAt: 1700000000000,
  expiresAt: 1731536000000,
  createdAt: 1700000000000,
  createdBy: 'system'
}

export const manualCreditTransaction: LoyaltyPointsTransaction = {
  uuid: 'loyalty-tx-manual-1',
  customerUuid: 'customer-1',
  type: LoyaltyTransactionType.ManualCredit,
  points: 100,
  reason: 'Compensation for delayed order',
  earnedAt: 1700100000000,
  expiresAt: 1731636000000,
  createdAt: 1700100000000,
  createdBy: 'admin'
}

export const customerLoyaltyWithTransactions: CustomerLoyalty = {
  balance: 150,
  transactions: [earnedTransaction, manualCreditTransaction]
}

export const emptyCustomerLoyalty: CustomerLoyalty = {
  balance: 0,
  transactions: []
}
