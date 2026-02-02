import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import type { LoyaltyTransaction } from '@core/entities/loyaltyTransaction'
import { LoyaltyTransactionType } from '@core/entities/loyaltyTransaction'
import type { UUID } from '@core/types/types'
import { getLoyaltyTransactions } from '@core/usecases/loyalty/get-loyalty-transactions/getLoyaltyTransactions'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Get loyalty transactions', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  const customerUuid = 'customer-uuid-1'
  const transaction1: LoyaltyTransaction = {
    uuid: 'tx-1',
    customerUuid,
    points: 50,
    type: LoyaltyTransactionType.Earning,
    orderUuid: 'order-1',
    createdAt: 1704067200000,
    createdBy: 'system',
    expiresAt: 1735689600000
  }
  const transaction2: LoyaltyTransaction = {
    uuid: 'tx-2',
    customerUuid,
    points: 25,
    type: LoyaltyTransactionType.ManualCredit,
    reason: 'Compensation for delay',
    createdAt: 1704153600000,
    createdBy: 'admin@pharmacy.com'
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway()
  })

  describe('Customer has loyalty transactions', () => {
    beforeEach(async () => {
      loyaltyGateway.feedWithTransactions(
        customerUuid,
        [transaction1, transaction2],
        75,
        50,
        1735689600000
      )
      await whenGetLoyaltyTransactions(customerUuid)
    })

    it('should update store with transactions', () => {
      expect(loyaltyStore.transactions).toStrictEqual([
        transaction1,
        transaction2
      ])
    })
  })

  describe('Customer has loyalty transactions - balance', () => {
    beforeEach(async () => {
      loyaltyGateway.feedWithTransactions(
        customerUuid,
        [transaction1, transaction2],
        75,
        50,
        1735689600000
      )
      await whenGetLoyaltyTransactions(customerUuid)
    })

    it('should update store with balance', () => {
      expect(loyaltyStore.balance).toStrictEqual(75)
    })
  })

  describe('Customer has loyalty transactions - expiring points', () => {
    beforeEach(async () => {
      loyaltyGateway.feedWithTransactions(
        customerUuid,
        [transaction1, transaction2],
        75,
        50,
        1735689600000
      )
      await whenGetLoyaltyTransactions(customerUuid)
    })

    it('should update store with expiring points', () => {
      expect(loyaltyStore.expiringPoints).toStrictEqual(50)
    })
  })

  describe('Customer has loyalty transactions - expiring date', () => {
    beforeEach(async () => {
      loyaltyGateway.feedWithTransactions(
        customerUuid,
        [transaction1, transaction2],
        75,
        50,
        1735689600000
      )
      await whenGetLoyaltyTransactions(customerUuid)
    })

    it('should update store with expiring date', () => {
      expect(loyaltyStore.expiringDate).toStrictEqual(1735689600000)
    })
  })

  describe('Customer has no transactions', () => {
    beforeEach(async () => {
      await whenGetLoyaltyTransactions('no-transactions-customer')
    })

    it('should update store with empty transactions', () => {
      expect(loyaltyStore.transactions).toStrictEqual([])
    })
  })

  describe('Customer has no transactions - balance', () => {
    beforeEach(async () => {
      await whenGetLoyaltyTransactions('no-transactions-customer')
    })

    it('should update store with zero balance', () => {
      expect(loyaltyStore.balance).toStrictEqual(0)
    })
  })

  const whenGetLoyaltyTransactions = async (uuid: UUID) => {
    await getLoyaltyTransactions(uuid, loyaltyGateway)
  }
})
