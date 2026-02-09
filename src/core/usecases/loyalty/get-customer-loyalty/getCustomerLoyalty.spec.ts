import { InMemoryLoyaltyGateway } from '@adapters/secondary/loyalty-gateways/inMemoryLoyaltyGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { CustomerLoyalty } from '@core/entities/loyaltyPointsTransaction'
import { getCustomerLoyalty } from '@core/usecases/loyalty/get-customer-loyalty/getCustomerLoyalty'
import { useLoyaltyStore } from '@store/loyaltyStore'
import {
  customerLoyaltyWithTransactions,
  emptyCustomerLoyalty
} from '@utils/testData/loyaltyPointsTransactions'
import { createPinia, setActivePinia } from 'pinia'

describe('Get customer loyalty', () => {
  let store: ReturnType<typeof useLoyaltyStore>
  let gateway: InMemoryLoyaltyGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLoyaltyStore()
    gateway = new InMemoryLoyaltyGateway(new FakeUuidGenerator())
  })

  describe('Customer has loyalty data', () => {
    beforeEach(async () => {
      givenCustomerLoyalty('customer-1', customerLoyaltyWithTransactions)
      await whenGetCustomerLoyalty('customer-1')
    })

    it('should set the customer loyalty in the store', () => {
      expect(store.customerLoyalty).toStrictEqual(
        customerLoyaltyWithTransactions
      )
    })
  })

  describe('Customer has no loyalty data', () => {
    it('should set empty loyalty in the store', async () => {
      await whenGetCustomerLoyalty('customer-unknown')
      expect(store.customerLoyalty).toStrictEqual(emptyCustomerLoyalty)
    })
  })

  const givenCustomerLoyalty = (
    customerUuid: string,
    loyalty: CustomerLoyalty
  ) => {
    gateway.feedWithCustomerLoyalty(customerUuid, loyalty)
  }

  const whenGetCustomerLoyalty = async (customerUuid: string) => {
    await getCustomerLoyalty(customerUuid, gateway)
  }
})
