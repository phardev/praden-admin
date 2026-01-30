import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { customerLoyaltyVM } from './customerLoyaltyVM'

describe('Customer Loyalty VM', () => {
  const customerUuid = 'customer-uuid-123'

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Balance', () => {
    it('should return balance from store', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setCustomerLoyalty(customerUuid, {
        balance: 150,
        totalEarned: 200,
        transactions: []
      })

      const vm = customerLoyaltyVM(customerUuid)

      expect(vm.balance).toStrictEqual(150)
    })

    it('should return 0 balance when no loyalty data exists', () => {
      const vm = customerLoyaltyVM(customerUuid)

      expect(vm.balance).toStrictEqual(0)
    })

    it('should format balance with points suffix', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setCustomerLoyalty(customerUuid, {
        balance: 150,
        totalEarned: 200,
        transactions: []
      })

      const vm = customerLoyaltyVM(customerUuid)

      expect(vm.balanceFormatted).toStrictEqual('150 points')
    })
  })

  describe('Total earned', () => {
    it('should return totalEarned from store', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setCustomerLoyalty(customerUuid, {
        balance: 150,
        totalEarned: 200,
        transactions: []
      })

      const vm = customerLoyaltyVM(customerUuid)

      expect(vm.totalEarned).toStrictEqual(200)
    })

    it('should format totalEarned with points suffix', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setCustomerLoyalty(customerUuid, {
        balance: 150,
        totalEarned: 200,
        transactions: []
      })

      const vm = customerLoyaltyVM(customerUuid)

      expect(vm.totalEarnedFormatted).toStrictEqual('200 points')
    })
  })

  describe('Transactions', () => {
    it('should return mapped transactions with order link', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setCustomerLoyalty(customerUuid, {
        balance: 50,
        totalEarned: 100,
        transactions: [
          {
            uuid: 'txn-1',
            orderUuid: 'order-uuid-1',
            points: 50,
            earnedAt: '2024-06-15T10:30:00Z',
            expiresAt: '2025-06-15T10:30:00Z',
            isExpired: false
          }
        ]
      })

      const vm = customerLoyaltyVM(customerUuid)

      expect(vm.transactions).toStrictEqual([
        {
          uuid: 'txn-1',
          orderUuid: 'order-uuid-1',
          orderLink: '/orders/order-uuid-1',
          points: 50,
          pointsFormatted: '50 points',
          earnedAt: '15/06/2024',
          expiresAt: '15/06/2025',
          isExpired: false
        }
      ])
    })

    it('should return empty array when no transactions', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setCustomerLoyalty(customerUuid, {
        balance: 0,
        totalEarned: 0,
        transactions: []
      })

      const vm = customerLoyaltyVM(customerUuid)

      expect(vm.transactions).toStrictEqual([])
    })
  })

  describe('Has history', () => {
    it('should return true when transactions exist', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setCustomerLoyalty(customerUuid, {
        balance: 50,
        totalEarned: 100,
        transactions: [
          {
            uuid: 'txn-1',
            orderUuid: 'order-uuid-1',
            points: 50,
            earnedAt: '2024-06-15T10:30:00Z',
            expiresAt: '2025-06-15T10:30:00Z',
            isExpired: false
          }
        ]
      })

      const vm = customerLoyaltyVM(customerUuid)

      expect(vm.hasHistory).toStrictEqual(true)
    })

    it('should return false when no transactions', () => {
      const loyaltyStore = useLoyaltyStore()
      loyaltyStore.setCustomerLoyalty(customerUuid, {
        balance: 0,
        totalEarned: 0,
        transactions: []
      })

      const vm = customerLoyaltyVM(customerUuid)

      expect(vm.hasHistory).toStrictEqual(false)
    })
  })
})
