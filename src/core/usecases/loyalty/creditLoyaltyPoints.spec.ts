import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/InMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { creditLoyaltyPoints } from '@core/usecases/loyalty/creditLoyaltyPoints'
import { useLoyaltyStore } from '@store/loyaltyStore'
import { createPinia, setActivePinia } from 'pinia'

describe('Credit loyalty points', () => {
  let loyaltyStore: ReturnType<typeof useLoyaltyStore>
  let loyaltyGateway: InMemoryLoyaltyGateway
  const customerUuid = 'customer-123'
  const points = 50
  const reason = 'Manual credit for customer service'

  beforeEach(() => {
    setActivePinia(createPinia())
    loyaltyStore = useLoyaltyStore()
    loyaltyGateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('When crediting points to a customer', () => {
    beforeEach(async () => {
      await whenCreditLoyaltyPoints(customerUuid, points, reason)
    })

    it('should credit points in gateway', async () => {
      const customerPoints =
        await loyaltyGateway.getCustomerPoints(customerUuid)
      expect(customerPoints.balance).toBe(50)
    })

    it('should update customer points in store', () => {
      const storePoints = loyaltyStore.customerPoints.get(customerUuid)
      expect(storePoints?.balance).toBe(50)
    })
  })

  const whenCreditLoyaltyPoints = async (
    customerUuid: string,
    points: number,
    reason: string
  ) => {
    await creditLoyaltyPoints(customerUuid, points, reason, loyaltyGateway)
  }
})
