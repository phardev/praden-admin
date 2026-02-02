import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import type { LoyaltyTransaction } from '@core/entities/loyaltyTransaction'
import { LoyaltyTransactionType } from '@core/entities/loyaltyTransaction'
import { creditLoyaltyPoints } from '@core/usecases/loyalty/credit-loyalty-points/creditLoyaltyPoints'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Credit loyalty points', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  const customerUuid = 'customer-uuid-1'
  const existingTransaction: LoyaltyTransaction = {
    uuid: 'tx-1',
    customerUuid,
    points: 50,
    type: LoyaltyTransactionType.Earning,
    orderUuid: 'order-1',
    createdAt: 1704067200000,
    createdBy: 'system',
    expiresAt: 1735689600000
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway()
  })

  describe('Credit points to customer', () => {
    beforeEach(async () => {
      loyaltyGateway.feedWithTransactions(
        customerUuid,
        [existingTransaction],
        50,
        0
      )
      await whenCreditPoints(customerUuid, 25, 'Compensation for delay')
    })

    it('should update balance in store after refresh', () => {
      expect(loyaltyStore.balance).toStrictEqual(75)
    })
  })

  const whenCreditPoints = async (
    uuid: string,
    points: number,
    reason: string
  ) => {
    await creditLoyaltyPoints(uuid, points, reason, loyaltyGateway)
  }
})
