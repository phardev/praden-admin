import type { LoyaltyPointsTransaction } from '@core/entities/loyaltyPointsTransaction'
import { TransactionType } from '@core/entities/loyaltyPointsTransaction'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  type CustomerLoyaltyItemVM,
  type CustomerLoyaltyVM,
  getCustomerLoyaltyVM
} from './customerLoyaltyVM'

const customerUuid = 'customer-uuid-1'

const earnedTransaction: LoyaltyPointsTransaction = {
  uuid: 'tx-1',
  type: TransactionType.Earned,
  points: 50,
  orderUuid: 'order-uuid-1',
  purchaseDate: '2024-03-15T10:00:00.000Z',
  expiresAt: '2025-03-15T10:00:00.000Z',
  createdAt: '2024-03-15T10:00:00.000Z'
}

const manualCreditTransaction: LoyaltyPointsTransaction = {
  uuid: 'tx-2',
  type: TransactionType.ManualCredit,
  points: 20,
  reason: 'Geste commercial',
  createdAt: '2024-04-01T14:30:00.000Z'
}

const expiredTransaction: LoyaltyPointsTransaction = {
  uuid: 'tx-3',
  type: TransactionType.Expired,
  points: 30,
  createdAt: '2024-05-10T08:00:00.000Z'
}

describe('customerLoyaltyVM', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
  })

  it('should format earned transaction type to French label', () => {
    loyaltyStore.setCustomerLoyalty(customerUuid, {
      balance: 50,
      transactions: [earnedTransaction]
    })

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result.items[0].type).toStrictEqual('Gagné')
  })

  it('should format manual credit transaction type to French label', () => {
    loyaltyStore.setCustomerLoyalty(customerUuid, {
      balance: 20,
      transactions: [manualCreditTransaction]
    })

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result.items[0].type).toStrictEqual('Crédit manuel')
  })

  it('should format expired transaction type to French label', () => {
    loyaltyStore.setCustomerLoyalty(customerUuid, {
      balance: 0,
      transactions: [expiredTransaction]
    })

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result.items[0].type).toStrictEqual('Expiré')
  })

  it('should format earned points with + prefix', () => {
    loyaltyStore.setCustomerLoyalty(customerUuid, {
      balance: 50,
      transactions: [earnedTransaction]
    })

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result.items[0].points).toStrictEqual('+50')
  })

  it('should format manual credit points with + prefix', () => {
    loyaltyStore.setCustomerLoyalty(customerUuid, {
      balance: 20,
      transactions: [manualCreditTransaction]
    })

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result.items[0].points).toStrictEqual('+20')
  })

  it('should format expired points with - prefix', () => {
    loyaltyStore.setCustomerLoyalty(customerUuid, {
      balance: 0,
      transactions: [expiredTransaction]
    })

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result.items[0].points).toStrictEqual('-30')
  })

  it('should format dates with French locale', () => {
    loyaltyStore.setCustomerLoyalty(customerUuid, {
      balance: 50,
      transactions: [earnedTransaction]
    })

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result.items[0].createdAt).toStrictEqual('15/03/2024')
  })

  it('should format expiresAt date with French locale', () => {
    loyaltyStore.setCustomerLoyalty(customerUuid, {
      balance: 50,
      transactions: [earnedTransaction]
    })

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result.items[0].expiresAt).toStrictEqual('15/03/2025')
  })

  it('should return empty items array when no transactions exist', () => {
    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result).toStrictEqual({
      balance: 0,
      items: [],
      isLoading: false
    })
  })

  it('should return all transaction fields correctly', () => {
    loyaltyStore.setCustomerLoyalty(customerUuid, {
      balance: 40,
      transactions: [
        earnedTransaction,
        manualCreditTransaction,
        expiredTransaction
      ]
    })

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result).toStrictEqual({
      balance: 40,
      items: [
        {
          uuid: 'tx-1',
          type: 'Gagné',
          points: '+50',
          orderUuid: 'order-uuid-1',
          reason: undefined,
          expiresAt: '15/03/2025',
          createdAt: '15/03/2024'
        },
        {
          uuid: 'tx-2',
          type: 'Crédit manuel',
          points: '+20',
          orderUuid: undefined,
          reason: 'Geste commercial',
          expiresAt: undefined,
          createdAt: '01/04/2024'
        },
        {
          uuid: 'tx-3',
          type: 'Expiré',
          points: '-30',
          orderUuid: undefined,
          reason: undefined,
          expiresAt: undefined,
          createdAt: '10/05/2024'
        }
      ],
      isLoading: false
    } satisfies CustomerLoyaltyVM)
  })

  it('should reflect loading state from store', () => {
    loyaltyStore.startLoading()

    const result = getCustomerLoyaltyVM(customerUuid)

    expect(result.isLoading).toStrictEqual(true)
  })
})
