import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { CustomerLoyalty } from '@core/entities/loyaltyPointsTransaction'
import { LoyaltyTransactionType } from '@core/entities/loyaltyPointsTransaction'
import { creditManualPoints } from '@core/usecases/loyalty/credit-manual-points/creditManualPoints'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { customerLoyaltyWithTransactions } from '@utils/testData/loyaltyPointsTransactions'
import { createPinia, setActivePinia } from 'pinia'

describe('Credit manual points', () => {
  let store: ReturnType<typeof useLoyaltyStore>
  let gateway: InMemoryLoyaltyGateway
  const uuidGenerator = new FakeUuidGenerator()

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLoyaltyStore()
    gateway = new InMemoryLoyaltyGateway(uuidGenerator)
  })

  describe('Customer has existing loyalty data', () => {
    beforeEach(async () => {
      givenCustomerLoyalty('customer-1', customerLoyaltyWithTransactions)
      givenStoreHasCustomerLoyalty(customerLoyaltyWithTransactions)
      uuidGenerator.setNext('new-tx-uuid')
      await whenCreditManualPoints('customer-1', 25, 'Gift for loyalty')
    })

    it('should add the transaction to the store', () => {
      expect(store.customerLoyalty!.transactions).toHaveLength(3)
    })

    it('should update the balance in the store', () => {
      expect(store.customerLoyalty!.balance).toBe(175)
    })

    it('should create a manual credit transaction', () => {
      const lastTransaction =
        store.customerLoyalty!.transactions[
          store.customerLoyalty!.transactions.length - 1
        ]
      expect(lastTransaction.type).toBe(LoyaltyTransactionType.ManualCredit)
    })

    it('should set the correct points on the transaction', () => {
      const lastTransaction =
        store.customerLoyalty!.transactions[
          store.customerLoyalty!.transactions.length - 1
        ]
      expect(lastTransaction.points).toBe(25)
    })

    it('should set the reason on the transaction', () => {
      const lastTransaction =
        store.customerLoyalty!.transactions[
          store.customerLoyalty!.transactions.length - 1
        ]
      expect(lastTransaction.reason).toBe('Gift for loyalty')
    })
  })

  const givenCustomerLoyalty = (
    customerUuid: string,
    loyalty: CustomerLoyalty
  ) => {
    gateway.feedWithCustomerLoyalty(customerUuid, loyalty)
  }

  const givenStoreHasCustomerLoyalty = (loyalty: CustomerLoyalty) => {
    store.setCustomerLoyalty(JSON.parse(JSON.stringify(loyalty)))
  }

  const whenCreditManualPoints = async (
    customerUuid: string,
    points: number,
    reason: string
  ) => {
    await creditManualPoints(customerUuid, points, reason, gateway)
  }
})
