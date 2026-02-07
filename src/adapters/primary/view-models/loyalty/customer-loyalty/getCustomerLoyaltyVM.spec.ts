import type { PointsTransaction } from '@core/entities/loyalty/pointsTransaction'
import { PointsTransactionType } from '@core/entities/loyalty/pointsTransaction'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  type GetCustomerLoyaltyVM,
  getCustomerLoyaltyVM
} from './getCustomerLoyaltyVM'

describe('getCustomerLoyaltyVM', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let vm: GetCustomerLoyaltyVM | null

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
  })

  it('should return null when customer loyalty is not loaded', () => {
    whenGetCustomerLoyaltyVM()

    expect(vm).toStrictEqual(null)
  })

  it('should return points balance', () => {
    givenCustomerLoyalty({ pointsBalance: 150, transactions: [] })

    whenGetCustomerLoyaltyVM()

    expect(vm!.pointsBalance).toStrictEqual(150)
  })

  it('should return hasTransactions false when no transactions', () => {
    givenCustomerLoyalty({ pointsBalance: 0, transactions: [] })

    whenGetCustomerLoyaltyVM()

    expect(vm!.hasTransactions).toStrictEqual(false)
  })

  it('should return hasTransactions true when transactions exist', () => {
    givenCustomerLoyalty({
      pointsBalance: 50,
      transactions: [earnedTransaction]
    })

    whenGetCustomerLoyaltyVM()

    expect(vm!.hasTransactions).toStrictEqual(true)
  })

  it('should format earned transaction with positive points', () => {
    givenCustomerLoyalty({
      pointsBalance: 50,
      transactions: [earnedTransaction]
    })

    whenGetCustomerLoyaltyVM()

    expect(vm!.transactions[0]).toStrictEqual({
      uuid: 'tx-1',
      type: 'EARNED',
      typeLabel: 'loyalty.customer.earned',
      points: '+50',
      description: 'Commande #123',
      formattedDate: '15 janv. 2024'
    })
  })

  it('should format expired transaction with negative points', () => {
    givenCustomerLoyalty({
      pointsBalance: 0,
      transactions: [expiredTransaction]
    })

    whenGetCustomerLoyaltyVM()

    expect(vm!.transactions[0]).toStrictEqual({
      uuid: 'tx-2',
      type: 'EXPIRED',
      typeLabel: 'loyalty.customer.expired',
      points: '-30',
      description: '',
      formattedDate: '20 janv. 2024'
    })
  })

  it('should format manual credit transaction with positive points', () => {
    givenCustomerLoyalty({
      pointsBalance: 100,
      transactions: [manualCreditTransaction]
    })

    whenGetCustomerLoyaltyVM()

    expect(vm!.transactions[0]).toStrictEqual({
      uuid: 'tx-3',
      type: 'MANUAL_CREDIT',
      typeLabel: 'loyalty.customer.manualCredit',
      points: '+100',
      description: 'Geste commercial',
      formattedDate: '25 janv. 2024'
    })
  })

  it('should return isLoading from store', () => {
    givenCustomerLoyalty({ pointsBalance: 0, transactions: [] })
    loyaltyStore.startLoading()

    whenGetCustomerLoyaltyVM()

    expect(vm!.isLoading).toStrictEqual(true)
  })

  const earnedTransaction: PointsTransaction = {
    uuid: 'tx-1',
    customerUuid: 'customer-1',
    type: PointsTransactionType.Earned,
    points: 50,
    orderUuid: 'order-123',
    description: 'Commande #123',
    createdAt: '2024-01-15T10:00:00.000Z'
  }

  const expiredTransaction: PointsTransaction = {
    uuid: 'tx-2',
    customerUuid: 'customer-1',
    type: PointsTransactionType.Expired,
    points: -30,
    createdAt: '2024-01-20T10:00:00.000Z'
  }

  const manualCreditTransaction: PointsTransaction = {
    uuid: 'tx-3',
    customerUuid: 'customer-1',
    type: PointsTransactionType.ManualCredit,
    points: 100,
    description: 'Geste commercial',
    createdAt: '2024-01-25T10:00:00.000Z'
  }

  const givenCustomerLoyalty = (loyalty: {
    pointsBalance: number
    transactions: Array<PointsTransaction>
  }) => {
    loyaltyStore.setCustomerLoyalty(loyalty)
  }

  const whenGetCustomerLoyaltyVM = () => {
    vm = getCustomerLoyaltyVM()
  }
})
