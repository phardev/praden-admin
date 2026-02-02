import {
  LoyaltyTransaction,
  LoyaltyTransactionType
} from '@core/entities/loyaltyTransaction'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { elodieDurand } from '@utils/testData/customers'
import { createPinia, setActivePinia } from 'pinia'
import { getLoyaltyTransactionsVM } from './getLoyaltyTransactionsVM'

describe('Get loyalty transactions view model', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
  })

  it('should return empty transactions array when no transactions for customer', () => {
    const vm = getLoyaltyTransactionsVM()

    expect(vm.items).toStrictEqual([])
  })

  it('should return transactions sorted by creation date most recent first', () => {
    const oldTransaction: LoyaltyTransaction = {
      uuid: 'transaction-1',
      customerUuid: elodieDurand.uuid,
      points: 10,
      type: LoyaltyTransactionType.Earning,
      orderUuid: 'order-1',
      createdAt: 1704067200000,
      createdBy: 'system'
    }
    const recentTransaction: LoyaltyTransaction = {
      uuid: 'transaction-2',
      customerUuid: elodieDurand.uuid,
      points: 5,
      type: LoyaltyTransactionType.ManualCredit,
      reason: 'Gesture commercial',
      createdAt: 1704153600000,
      createdBy: 'admin@example.com'
    }
    loyaltyStore.setTransactions([oldTransaction, recentTransaction])

    const vm = getLoyaltyTransactionsVM()

    expect(vm.items).toStrictEqual([
      {
        uuid: 'transaction-2',
        points: 5,
        type: LoyaltyTransactionType.ManualCredit,
        orderUuid: undefined,
        reason: 'Gesture commercial',
        createdAt: 1704153600000
      },
      {
        uuid: 'transaction-1',
        points: 10,
        type: LoyaltyTransactionType.Earning,
        orderUuid: 'order-1',
        reason: undefined,
        createdAt: 1704067200000
      }
    ])
  })

  it('should return balance from store', () => {
    loyaltyStore.setBalance(150)

    const vm = getLoyaltyTransactionsVM()

    expect(vm.balance).toBe(150)
  })

  it('should return expiring points from store', () => {
    loyaltyStore.setExpiringPoints(25)

    const vm = getLoyaltyTransactionsVM()

    expect(vm.expiringPoints).toBe(25)
  })

  it('should return expiring date from store', () => {
    loyaltyStore.setExpiringDate(1735689600000)

    const vm = getLoyaltyTransactionsVM()

    expect(vm.expiringDate).toBe(1735689600000)
  })

  it('should reflect loading state when store is loading', () => {
    loyaltyStore.startLoading()

    const vm = getLoyaltyTransactionsVM()

    expect(vm.isLoading).toBe(true)
  })

  it('should reflect not loading state when store is not loading', () => {
    const vm = getLoyaltyTransactionsVM()

    expect(vm.isLoading).toBe(false)
  })
})
