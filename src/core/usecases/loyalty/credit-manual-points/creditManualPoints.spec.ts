import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { CreditPointsDTO } from '@core/gateways/loyaltyGateway'
import type { UUID } from '@core/types/types'
import { creditManualPoints } from '@core/usecases/loyalty/credit-manual-points/creditManualPoints'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { earnedTransaction } from '@utils/testData/loyalty'
import { createPinia, setActivePinia } from 'pinia'

describe('Credit manual points', () => {
  let loyaltyGateway: InMemoryLoyaltyGateway
  let loyaltyStore: any
  const uuidGenerator = new FakeUuidGenerator()
  const customerUuid = 'customer-uuid-1'

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyGateway = new InMemoryLoyaltyGateway(uuidGenerator)
    loyaltyStore = useLoyaltyStore()
  })

  describe('Credit points to a customer with no existing loyalty data', () => {
    beforeEach(async () => {
      uuidGenerator.setNext('new-transaction-uuid')
      await whenCreditManualPoints(customerUuid, {
        points: 100,
        reason: 'Customer loyalty reward'
      })
    })

    it('should store the customer loyalty with new transaction', () => {
      expect(loyaltyStore.customerLoyalty[customerUuid]).toStrictEqual({
        balance: 100,
        transactions: [
          {
            uuid: 'new-transaction-uuid',
            type: 'MANUAL_CREDIT',
            points: 100,
            reason: 'Customer loyalty reward',
            createdAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      })
    })
  })

  describe('Credit points to a customer with existing loyalty data', () => {
    beforeEach(async () => {
      loyaltyStore.customerLoyalty[customerUuid] = {
        balance: 50,
        transactions: [earnedTransaction]
      }
      uuidGenerator.setNext('another-transaction-uuid')
      await whenCreditManualPoints(customerUuid, {
        points: 75,
        reason: 'Compensation'
      })
    })

    it('should add the new transaction and update balance', () => {
      expect(loyaltyStore.customerLoyalty[customerUuid]).toStrictEqual({
        balance: 125,
        transactions: [
          earnedTransaction,
          {
            uuid: 'another-transaction-uuid',
            type: 'MANUAL_CREDIT',
            points: 75,
            reason: 'Compensation',
            createdAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      })
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = loyaltyStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenCreditManualPoints(customerUuid, {
        points: 10,
        reason: 'Test'
      })
    })

    it('should be aware that loading is over', async () => {
      await whenCreditManualPoints(customerUuid, {
        points: 10,
        reason: 'Test'
      })
      expect(loyaltyStore.isLoading).toBe(false)
    })
  })

  const whenCreditManualPoints = async (
    customerUuid: UUID,
    dto: CreditPointsDTO
  ) => {
    await creditManualPoints(customerUuid, dto, loyaltyGateway)
  }
})
