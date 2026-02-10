import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { CustomerLoyaltyPoints } from '@core/entities/loyalty'
import { LoyaltyTransactionType } from '@core/entities/loyalty'
import { getCustomerLoyaltyPoints } from '@core/usecases/loyalty/getCustomerLoyaltyPoints'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Get customer loyalty points', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway
  const customerUuid = 'customer-123'

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('When customer has no points', () => {
    it('should set empty points in store', async () => {
      await whenGetCustomerLoyaltyPoints(customerUuid)
      expect(loyaltyStore.customerPoints.get(customerUuid)).toStrictEqual({
        balance: 0,
        transactions: []
      })
    })
  })

  describe('When customer has points', () => {
    const existingPoints: CustomerLoyaltyPoints = {
      balance: 100,
      transactions: [
        {
          uuid: 'tx-1',
          customerUuid,
          type: LoyaltyTransactionType.Earned,
          points: 100,
          orderUuid: 'order-1',
          createdAt: 1704067200000
        }
      ]
    }

    beforeEach(() => {
      givenCustomerHasPoints(customerUuid, existingPoints)
    })

    it('should set customer points in store', async () => {
      await whenGetCustomerLoyaltyPoints(customerUuid)
      expect(loyaltyStore.customerPoints.get(customerUuid)).toStrictEqual(
        existingPoints
      )
    })
  })

  const givenCustomerHasPoints = (
    customerUuid: string,
    points: CustomerLoyaltyPoints
  ) => {
    loyaltyGateway.feedCustomerPoints(customerUuid, points)
  }

  const whenGetCustomerLoyaltyPoints = async (customerUuid: string) => {
    await getCustomerLoyaltyPoints(customerUuid, loyaltyGateway)
  }
})
