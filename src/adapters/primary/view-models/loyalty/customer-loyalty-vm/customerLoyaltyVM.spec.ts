import type { CustomerLoyalty } from '@core/entities/loyaltyPointsTransaction'
import { LoyaltyTransactionType } from '@core/entities/loyaltyPointsTransaction'
import { useLoyaltyStore } from '@store/loyaltyStore'
import {
  customerLoyaltyWithTransactions,
  earnedTransaction,
  emptyCustomerLoyalty,
  manualCreditTransaction
} from '@utils/testData/loyaltyPointsTransactions'
import { createPinia, setActivePinia } from 'pinia'
import type { CustomerLoyaltyVM } from './customerLoyaltyVM'
import { customerLoyaltyVM } from './customerLoyaltyVM'

describe('Customer loyalty VM', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
  })

  describe('No customer loyalty loaded', () => {
    it('should return empty VM when no customer loyalty exists', () => {
      expect(customerLoyaltyVM()).toStrictEqual({
        balance: 0,
        transactions: [],
        isLoading: false
      })
    })
  })

  describe('Customer loyalty is loading', () => {
    it('should return isLoading true when store is loading', () => {
      loyaltyStore.startLoading()
      expect(customerLoyaltyVM().isLoading).toStrictEqual(true)
    })
  })

  describe('Customer has no transactions', () => {
    it('should return zero balance and empty transactions', () => {
      givenCustomerLoyalty(emptyCustomerLoyalty)
      expect(customerLoyaltyVM()).toStrictEqual({
        balance: 0,
        transactions: [],
        isLoading: false
      })
    })
  })

  describe('Customer has transactions', () => {
    beforeEach(() => {
      givenCustomerLoyalty(customerLoyaltyWithTransactions)
    })

    it('should return the balance', () => {
      expect(customerLoyaltyVM().balance).toStrictEqual(150)
    })

    it('should return the correct number of transactions', () => {
      expect(customerLoyaltyVM().transactions.length).toStrictEqual(2)
    })

    it('should format earned transaction', () => {
      expect(customerLoyaltyVM().transactions[0]).toStrictEqual({
        uuid: earnedTransaction.uuid,
        date: '14 nov. 2023',
        type: LoyaltyTransactionType.Earned,
        points: 50,
        orderUuid: 'order-1',
        reason: undefined,
        expiresAt: '13 nov. 2024',
        isExpired: true
      })
    })

    it('should format manual credit transaction', () => {
      expect(customerLoyaltyVM().transactions[1]).toStrictEqual({
        uuid: manualCreditTransaction.uuid,
        date: '16 nov. 2023',
        type: LoyaltyTransactionType.ManualCredit,
        points: 100,
        orderUuid: undefined,
        reason: 'Compensation for delayed order',
        expiresAt: '15 nov. 2024',
        isExpired: true
      })
    })
  })

  const givenCustomerLoyalty = (loyalty: CustomerLoyalty) => {
    loyaltyStore.setCustomerLoyalty(loyalty)
  }
})
