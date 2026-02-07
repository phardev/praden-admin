import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { PointsTransaction } from '@core/entities/loyalty/pointsTransaction'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { getCustomerLoyalty } from './getCustomerLoyalty'

describe('Get customer loyalty', () => {
  let loyaltyStore: any
  let loyaltyGateway: InMemoryLoyaltyGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
  })

  describe('Given a customer with no transactions', () => {
    it('should set zero balance in the store', async () => {
      await whenGetCustomerLoyalty('customer-1')
      expect(loyaltyStore.customerLoyalty!.pointsBalance).toBe(0)
    })

    it('should set empty transactions in the store', async () => {
      await whenGetCustomerLoyalty('customer-1')
      expect(loyaltyStore.customerLoyalty!.transactions).toStrictEqual([])
    })
  })

  describe('Given a customer with transactions', () => {
    const transactionA: PointsTransaction = {
      uuid: 'tx-1',
      customerUuid: 'customer-1',
      type: 'EARNED',
      points: 50,
      orderUuid: 'order-1',
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    const transactionB: PointsTransaction = {
      uuid: 'tx-2',
      customerUuid: 'customer-1',
      type: 'MANUAL_CREDIT',
      points: 20,
      description: 'Bonus points',
      createdAt: '2024-01-02T00:00:00.000Z'
    }

    beforeEach(() => {
      loyaltyGateway.feedWithTransactions(transactionA, transactionB)
    })

    it('should set the points balance in the store', async () => {
      await whenGetCustomerLoyalty('customer-1')
      expect(loyaltyStore.customerLoyalty!.pointsBalance).toBe(70)
    })

    it('should set the transactions in the store', async () => {
      await whenGetCustomerLoyalty('customer-1')
      expect(loyaltyStore.customerLoyalty!.transactions).toStrictEqual([
        transactionA,
        transactionB
      ])
    })
  })

  describe('Given transactions for multiple customers', () => {
    const customer1Transaction: PointsTransaction = {
      uuid: 'tx-1',
      customerUuid: 'customer-1',
      type: 'EARNED',
      points: 50,
      orderUuid: 'order-1',
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    const customer2Transaction: PointsTransaction = {
      uuid: 'tx-2',
      customerUuid: 'customer-2',
      type: 'EARNED',
      points: 100,
      orderUuid: 'order-2',
      createdAt: '2024-01-02T00:00:00.000Z'
    }

    beforeEach(() => {
      loyaltyGateway.feedWithTransactions(
        customer1Transaction,
        customer2Transaction
      )
    })

    it('should only return transactions for the requested customer', async () => {
      await whenGetCustomerLoyalty('customer-1')
      expect(loyaltyStore.customerLoyalty!.transactions).toStrictEqual([
        customer1Transaction
      ])
    })

    it('should set the correct balance for the requested customer', async () => {
      await whenGetCustomerLoyalty('customer-1')
      expect(loyaltyStore.customerLoyalty!.pointsBalance).toBe(50)
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      let isLoadingDuringOperation = false
      const unsubscribe = loyaltyStore.$subscribe(
        (_mutation: any, state: any) => {
          if (state.isLoading) {
            isLoadingDuringOperation = true
          }
          unsubscribe()
        }
      )
      await whenGetCustomerLoyalty('customer-1')
      expect(isLoadingDuringOperation).toBe(true)
    })

    it('should be aware when loading is done', async () => {
      await whenGetCustomerLoyalty('customer-1')
      expect(loyaltyStore.isLoading).toBe(false)
    })
  })

  const whenGetCustomerLoyalty = async (customerUuid: string) => {
    await getCustomerLoyalty(customerUuid, loyaltyGateway)
  }
})
