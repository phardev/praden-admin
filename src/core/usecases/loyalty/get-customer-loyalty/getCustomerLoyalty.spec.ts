import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import type { CustomerLoyalty } from '@core/entities/loyalty'
import { getCustomerLoyalty } from '@core/usecases/loyalty/get-customer-loyalty/getCustomerLoyalty'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Get Customer Loyalty', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway()
  })

  describe('When customer has loyalty data', () => {
    it('should save the customer loyalty in the store', async () => {
      const customerUuid = 'customer-uuid-1'
      const loyalty: CustomerLoyalty = {
        balance: 100,
        totalEarned: 150,
        transactions: [
          {
            uuid: 'transaction-uuid-1',
            orderUuid: 'order-uuid-1',
            points: 50,
            earnedAt: '2025-01-01T00:00:00.000Z',
            expiresAt: '2026-01-01T00:00:00.000Z',
            isExpired: false
          },
          {
            uuid: 'transaction-uuid-2',
            orderUuid: 'order-uuid-2',
            points: 100,
            earnedAt: '2025-06-01T00:00:00.000Z',
            expiresAt: '2026-06-01T00:00:00.000Z',
            isExpired: false
          }
        ]
      }
      givenExistingCustomerLoyalty(customerUuid, loyalty)
      await whenGetCustomerLoyalty(customerUuid)
      expectCustomerLoyaltyToBe(customerUuid, loyalty)
    })
  })

  describe('When customer has no loyalty data', () => {
    it('should save empty loyalty data in the store', async () => {
      const customerUuid = 'customer-uuid-2'
      await whenGetCustomerLoyalty(customerUuid)
      expectCustomerLoyaltyToBe(customerUuid, {
        balance: 0,
        totalEarned: 0,
        transactions: []
      })
    })
  })

  describe('When fetching different customers', () => {
    it('should store loyalty data keyed by customer uuid', async () => {
      const customerUuid1 = 'customer-uuid-1'
      const customerUuid2 = 'customer-uuid-2'
      const loyalty1: CustomerLoyalty = {
        balance: 50,
        totalEarned: 50,
        transactions: []
      }
      const loyalty2: CustomerLoyalty = {
        balance: 200,
        totalEarned: 200,
        transactions: []
      }
      givenExistingCustomerLoyalty(customerUuid1, loyalty1)
      givenExistingCustomerLoyalty(customerUuid2, loyalty2)
      await whenGetCustomerLoyalty(customerUuid1)
      await whenGetCustomerLoyalty(customerUuid2)
      expectCustomerLoyaltyToBe(customerUuid2, loyalty2)
    })
  })

  const givenExistingCustomerLoyalty = (
    customerUuid: string,
    loyalty: CustomerLoyalty
  ) => {
    loyaltyGateway.feedWithCustomerLoyalty(customerUuid, loyalty)
  }

  const whenGetCustomerLoyalty = async (customerUuid: string) => {
    await getCustomerLoyalty(customerUuid, loyaltyGateway)
  }

  const expectCustomerLoyaltyToBe = (
    customerUuid: string,
    loyalty: CustomerLoyalty
  ) => {
    expect(loyaltyStore.customerLoyalty.get(customerUuid)).toStrictEqual(
      loyalty
    )
  }
})
