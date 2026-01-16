import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import type { CustomerLoyaltyPoints } from '@core/entities/loyaltyTransaction'
import { getCustomerLoyaltyPoints } from '@core/usecases/loyalty/get-customer-loyalty-points/getCustomerLoyaltyPoints'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Get customer loyalty points', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway()
  })

  describe('Customer has no loyalty points', () => {
    it('should set empty loyalty in store', async () => {
      await whenGetCustomerLoyaltyPoints('customer-uuid')
      expectCustomerLoyaltyToBe({
        totalPoints: 0,
        activePoints: 0,
        transactions: []
      })
    })
  })

  describe('Customer has loyalty points', () => {
    it('should set loyalty in store', async () => {
      const loyalty: CustomerLoyaltyPoints = {
        totalPoints: 15,
        activePoints: 10,
        transactions: [
          {
            uuid: 'transaction-1',
            orderUuid: 'order-1',
            points: 10,
            eligibleAmount: 10000,
            earnedAt: 1699000000000,
            expiresAt: 1730536000000,
            isExpired: false
          },
          {
            uuid: 'transaction-2',
            orderUuid: 'order-2',
            points: 5,
            eligibleAmount: 5000,
            earnedAt: 1698000000000,
            expiresAt: 1729622400000,
            isExpired: true
          }
        ]
      }
      givenCustomerLoyalty('customer-uuid', loyalty)
      await whenGetCustomerLoyaltyPoints('customer-uuid')
      expectCustomerLoyaltyToBe(loyalty)
    })
  })

  const givenCustomerLoyalty = (
    customerUuid: string,
    loyalty: CustomerLoyaltyPoints
  ) => {
    loyaltyGateway.feedWithCustomerLoyalty(customerUuid, loyalty)
  }

  const whenGetCustomerLoyaltyPoints = async (customerUuid: string) => {
    await getCustomerLoyaltyPoints(customerUuid, loyaltyGateway)
  }

  const expectCustomerLoyaltyToBe = (loyalty: CustomerLoyaltyPoints) => {
    expect(loyaltyStore.customerLoyalty).toStrictEqual(loyalty)
  }
})
