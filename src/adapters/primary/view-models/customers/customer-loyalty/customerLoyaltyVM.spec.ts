import type { LoyaltyTransaction } from '@core/entities/loyaltyTransaction'
import { LoyaltyTransactionType } from '@core/entities/loyaltyTransaction'
import { useCustomerStore } from '@store/customerStore'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'
import { customerLoyaltyVM } from './customerLoyaltyVM'

describe('Customer Loyalty View Model', () => {
  let customerStore: ReturnType<typeof useCustomerStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
  })

  describe('Balance', () => {
    it('should return 0 when customer has no loyalty points', () => {
      customerStore.setCurrent({ ...elodieDurand, loyaltyPointsBalance: 0 })

      const vm = customerLoyaltyVM()

      expect(vm.balance).toBe(0)
    })

    it('should return the customer loyalty points balance', () => {
      customerStore.setCurrent({ ...elodieDurand, loyaltyPointsBalance: 150 })

      const vm = customerLoyaltyVM()

      expect(vm.balance).toBe(150)
    })
  })

  describe('History', () => {
    it('should return empty array when customer has no loyalty history', () => {
      customerStore.setCurrent({
        ...elodieDurand,
        loyaltyPointsBalance: 0,
        loyaltyPointsHistory: undefined
      })

      const vm = customerLoyaltyVM()

      expect(vm.history).toStrictEqual([])
    })

    it('should return formatted history items sorted by date descending', () => {
      const transactions: Array<LoyaltyTransaction> = [
        {
          uuid: 'tx-1',
          points: 10,
          type: LoyaltyTransactionType.Earned,
          orderUuid: 'order-1',
          expiresAt: '2026-01-15T10:00:00.000Z',
          createdAt: '2025-01-15T10:00:00.000Z'
        },
        {
          uuid: 'tx-2',
          points: 20,
          type: LoyaltyTransactionType.Earned,
          orderUuid: 'order-2',
          expiresAt: '2026-02-20T14:30:00.000Z',
          createdAt: '2025-02-20T14:30:00.000Z'
        }
      ]
      customerStore.setCurrent({
        ...elodieDurand,
        loyaltyPointsBalance: 30,
        loyaltyPointsHistory: transactions
      })

      const vm = customerLoyaltyVM()

      expect(vm.history).toStrictEqual([
        {
          uuid: 'tx-2',
          points: 20,
          type: LoyaltyTransactionType.Earned,
          orderUuid: 'order-2',
          expiresAt: '2026-02-20T14:30:00.000Z',
          createdAt: '2025-02-20T14:30:00.000Z',
          formattedDate: '20/02/2025',
          formattedExpiresAt: '20/02/2026',
          isPositive: true
        },
        {
          uuid: 'tx-1',
          points: 10,
          type: LoyaltyTransactionType.Earned,
          orderUuid: 'order-1',
          expiresAt: '2026-01-15T10:00:00.000Z',
          createdAt: '2025-01-15T10:00:00.000Z',
          formattedDate: '15/01/2025',
          formattedExpiresAt: '15/01/2026',
          isPositive: true
        }
      ])
    })

    it('should mark redeemed points as negative', () => {
      const transactions: Array<LoyaltyTransaction> = [
        {
          uuid: 'tx-1',
          points: 50,
          type: LoyaltyTransactionType.Redeemed,
          createdAt: '2025-01-15T10:00:00.000Z'
        }
      ]
      customerStore.setCurrent({
        ...elodieDurand,
        loyaltyPointsBalance: 100,
        loyaltyPointsHistory: transactions
      })

      const vm = customerLoyaltyVM()

      expect(vm.history[0].isPositive).toBe(false)
    })

    it('should mark expired points as negative', () => {
      const transactions: Array<LoyaltyTransaction> = [
        {
          uuid: 'tx-1',
          points: 25,
          type: LoyaltyTransactionType.Expired,
          createdAt: '2025-01-15T10:00:00.000Z'
        }
      ]
      customerStore.setCurrent({
        ...elodieDurand,
        loyaltyPointsBalance: 0,
        loyaltyPointsHistory: transactions
      })

      const vm = customerLoyaltyVM()

      expect(vm.history[0].isPositive).toBe(false)
    })

    it('should handle adjusted points as positive when points are positive', () => {
      const transactions: Array<LoyaltyTransaction> = [
        {
          uuid: 'tx-1',
          points: 10,
          type: LoyaltyTransactionType.Adjusted,
          createdAt: '2025-01-15T10:00:00.000Z'
        }
      ]
      customerStore.setCurrent({
        ...elodieDurand,
        loyaltyPointsBalance: 10,
        loyaltyPointsHistory: transactions
      })

      const vm = customerLoyaltyVM()

      expect(vm.history[0].isPositive).toBe(true)
    })
  })

  describe('hasHistory', () => {
    it('should return false when customer has no loyalty history', () => {
      customerStore.setCurrent({
        ...elodieDurand,
        loyaltyPointsBalance: 0,
        loyaltyPointsHistory: undefined
      })

      const vm = customerLoyaltyVM()

      expect(vm.hasHistory).toBe(false)
    })

    it('should return true when customer has loyalty history', () => {
      const transactions: Array<LoyaltyTransaction> = [
        {
          uuid: 'tx-1',
          points: 10,
          type: LoyaltyTransactionType.Earned,
          createdAt: '2025-01-15T10:00:00.000Z'
        }
      ]
      customerStore.setCurrent({
        ...elodieDurand,
        loyaltyPointsBalance: 10,
        loyaltyPointsHistory: transactions
      })

      const vm = customerLoyaltyVM()

      expect(vm.hasHistory).toBe(true)
    })
  })
})
