import { LoyaltyTransactionType } from '@core/entities/loyalty'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { getCustomerPointsVM } from './customerPointsVM'

describe('customerPointsVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should return null when customer points not found', () => {
    const result = getCustomerPointsVM('unknown-customer')

    expect(result).toStrictEqual(null)
  })

  it('should return balance from store', () => {
    const store = useLoyaltyStore()
    store.setCustomerPoints('customer-123', {
      balance: 150,
      transactions: []
    })

    const result = getCustomerPointsVM('customer-123')

    expect(result?.balance).toStrictEqual(150)
  })

  it('should format earned transaction', () => {
    const store = useLoyaltyStore()
    store.setCustomerPoints('customer-123', {
      balance: 50,
      transactions: [
        {
          uuid: 'tx-1',
          customerUuid: 'customer-123',
          type: LoyaltyTransactionType.Earned,
          points: 50,
          orderUuid: 'order-456',
          createdAt: 1705314600000,
          expiresAt: 1736850600000
        }
      ]
    })

    const result = getCustomerPointsVM('customer-123')

    expect(result?.transactions[0].type).toStrictEqual(
      LoyaltyTransactionType.Earned
    )
  })

  it('should format manual credit transaction with reason', () => {
    const store = useLoyaltyStore()
    store.setCustomerPoints('customer-123', {
      balance: 100,
      transactions: [
        {
          uuid: 'tx-2',
          customerUuid: 'customer-123',
          type: LoyaltyTransactionType.ManualCredit,
          points: 100,
          reason: 'Geste commercial',
          creditedBy: 'admin@example.com',
          createdAt: 1706796000000,
          expiresAt: 1738332000000
        }
      ]
    })

    const result = getCustomerPointsVM('customer-123')

    expect(result?.transactions[0].reason).toStrictEqual('Geste commercial')
  })

  it('should format manual credit transaction with credited by', () => {
    const store = useLoyaltyStore()
    store.setCustomerPoints('customer-123', {
      balance: 100,
      transactions: [
        {
          uuid: 'tx-2',
          customerUuid: 'customer-123',
          type: LoyaltyTransactionType.ManualCredit,
          points: 100,
          reason: 'Geste commercial',
          creditedBy: 'admin@example.com',
          createdAt: 1706796000000,
          expiresAt: 1738332000000
        }
      ]
    })

    const result = getCustomerPointsVM('customer-123')

    expect(result?.transactions[0].creditedBy).toStrictEqual(
      'admin@example.com'
    )
  })

  it('should format expired transaction', () => {
    const store = useLoyaltyStore()
    store.setCustomerPoints('customer-123', {
      balance: 0,
      transactions: [
        {
          uuid: 'tx-3',
          customerUuid: 'customer-123',
          type: LoyaltyTransactionType.Expired,
          points: -25,
          createdAt: 1709251200000
        }
      ]
    })

    const result = getCustomerPointsVM('customer-123')

    expect(result?.transactions[0].points).toStrictEqual(-25)
  })

  it('should format date to locale string', () => {
    const store = useLoyaltyStore()
    store.setCustomerPoints('customer-123', {
      balance: 50,
      transactions: [
        {
          uuid: 'tx-1',
          customerUuid: 'customer-123',
          type: LoyaltyTransactionType.Earned,
          points: 50,
          createdAt: 1705314600000
        }
      ]
    })

    const result = getCustomerPointsVM('customer-123')

    expect(result?.transactions[0].formattedCreatedAt).toStrictEqual(
      '15 janv. 2024'
    )
  })

  it('should format expiration date when present', () => {
    const store = useLoyaltyStore()
    store.setCustomerPoints('customer-123', {
      balance: 50,
      transactions: [
        {
          uuid: 'tx-1',
          customerUuid: 'customer-123',
          type: LoyaltyTransactionType.Earned,
          points: 50,
          createdAt: 1705314600000,
          expiresAt: 1736850600000
        }
      ]
    })

    const result = getCustomerPointsVM('customer-123')

    expect(result?.transactions[0].formattedExpiresAt).toStrictEqual(
      '14 janv. 2025'
    )
  })

  it('should return null expiration date when not present', () => {
    const store = useLoyaltyStore()
    store.setCustomerPoints('customer-123', {
      balance: 50,
      transactions: [
        {
          uuid: 'tx-1',
          customerUuid: 'customer-123',
          type: LoyaltyTransactionType.Expired,
          points: -50,
          createdAt: 1705314600000
        }
      ]
    })

    const result = getCustomerPointsVM('customer-123')

    expect(result?.transactions[0].formattedExpiresAt).toStrictEqual(null)
  })

  it('should sort transactions by date descending', () => {
    const store = useLoyaltyStore()
    store.setCustomerPoints('customer-123', {
      balance: 150,
      transactions: [
        {
          uuid: 'tx-1',
          customerUuid: 'customer-123',
          type: LoyaltyTransactionType.Earned,
          points: 50,
          createdAt: 1704067200000
        },
        {
          uuid: 'tx-2',
          customerUuid: 'customer-123',
          type: LoyaltyTransactionType.Earned,
          points: 100,
          createdAt: 1706745600000
        }
      ]
    })

    const result = getCustomerPointsVM('customer-123')

    expect(result?.transactions.map((t) => t.uuid)).toStrictEqual([
      'tx-2',
      'tx-1'
    ])
  })
})
