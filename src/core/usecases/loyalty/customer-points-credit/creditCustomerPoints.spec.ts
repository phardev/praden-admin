import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { PointsTransaction } from '@core/entities/loyalty/pointsTransaction'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'
import { creditCustomerPoints } from './creditCustomerPoints'

describe('Credit customer points', () => {
  let loyaltyStore: any
  let loyaltyGateway: InMemoryLoyaltyGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
  })

  describe('Given a customer with existing loyalty data', () => {
    const existingTransaction: PointsTransaction = {
      uuid: 'tx-existing',
      customerUuid: 'customer-1',
      type: 'EARNED',
      points: 50,
      orderUuid: 'order-1',
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    beforeEach(() => {
      loyaltyGateway.feedWithTransactions(existingTransaction)
    })

    describe('For crediting points with description', () => {
      it('should refresh the store with all transactions from the gateway', async () => {
        uuidGenerator.setNext('tx-new')
        await whenCreditCustomerPoints('customer-1', 25, 'Bonus points')
        expect(loyaltyStore.customerLoyalty!.transactions).toHaveLength(2)
      })

      it('should refresh the store with the correct balance', async () => {
        uuidGenerator.setNext('tx-new')
        await whenCreditCustomerPoints('customer-1', 25, 'Bonus points')
        expect(loyaltyStore.customerLoyalty!.pointsBalance).toBe(75)
      })

      it('should save the transaction in the gateway', async () => {
        uuidGenerator.setNext('tx-new')
        await whenCreditCustomerPoints('customer-1', 25, 'Bonus points')
        const transactions = loyaltyGateway.getTransactions()
        expect(transactions).toHaveLength(2)
      })
    })

    describe('For crediting points without description', () => {
      it('should refresh the store with all transactions from the gateway', async () => {
        uuidGenerator.setNext('tx-no-desc')
        await whenCreditCustomerPoints('customer-1', 10)
        expect(loyaltyStore.customerLoyalty!.transactions).toHaveLength(2)
      })

      it('should refresh the store with the correct balance', async () => {
        uuidGenerator.setNext('tx-no-desc')
        await whenCreditCustomerPoints('customer-1', 10)
        expect(loyaltyStore.customerLoyalty!.pointsBalance).toBe(60)
      })
    })
  })

  describe('For another amount', () => {
    const existingTransaction: PointsTransaction = {
      uuid: 'tx-existing-2',
      customerUuid: 'customer-2',
      type: 'EARNED',
      points: 100,
      createdAt: '2024-01-01T00:00:00.000Z'
    }

    beforeEach(() => {
      loyaltyGateway.feedWithTransactions(existingTransaction)
    })

    it('should refresh the store with the correct balance', async () => {
      uuidGenerator.setNext('tx-another')
      await whenCreditCustomerPoints('customer-2', 200, 'Large bonus')
      expect(loyaltyStore.customerLoyalty!.pointsBalance).toBe(300)
    })
  })

  const whenCreditCustomerPoints = async (
    customerUuid: string,
    points: number,
    description?: string
  ) => {
    await creditCustomerPoints(
      customerUuid,
      points,
      loyaltyGateway,
      description
    )
  }
})
