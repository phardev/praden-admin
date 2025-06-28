import { InMemoryNewsletterGateway } from '@adapters/secondary/newsletter-gateways/inMemoryNewsletterGateway'
import { useNewsletterStore } from '@store/newsletterStore'
import { createPinia, setActivePinia } from 'pinia'
import {
  subscribeToNewsletter,
  SubscribeToNewsletterDTO
} from './subscribeToNewsletter'
import { NewsletterSubscription } from '@core/entities/newsletterSubscription'
import { Timestamp, UUID } from '@core/types/types'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { lucasLefevre } from '@utils/testData/customers'
import { useCustomerStore } from '@store/customerStore'
import { Customer } from '@core/entities/customer'
import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'

describe('Subscribe to newsletter', () => {
  let newsletterStore: any
  let customerStore: any
  let newsletterGateway: InMemoryNewsletterGateway
  let customerGateway: InMemoryCustomerGateway
  let dto: SubscribeToNewsletterDTO
  let uuid: UUID
  let now: Timestamp
  let uuidGenerator: FakeUuidGenerator
  let dateProvider: FakeDateProvider
  let expectedSubscription: NewsletterSubscription

  beforeEach(() => {
    setActivePinia(createPinia())
    customerStore = useCustomerStore()
    newsletterStore = useNewsletterStore()
    uuidGenerator = new FakeUuidGenerator()
    dateProvider = new FakeDateProvider()
    newsletterGateway = new InMemoryNewsletterGateway(
      uuidGenerator,
      dateProvider
    )
    customerGateway = new InMemoryCustomerGateway(uuidGenerator)
  })

  describe('Guest subscription', () => {
    beforeEach(async () => {
      uuid = 'guest-uuid'
      uuidGenerator.setNext(uuid)
      now = 123456789
      dateProvider.feedWith(now)
      dto = { email: 'guest@gmail.com' }
      await whenSubscribeToNewsletter()
      expectedSubscription = {
        uuid,
        email: dto.email,
        subscribedAt: now
      }
    })
    it('should save in store', () => {
      expectStoreToEquals(expectedSubscription)
    })
    it('should save in gateway', async () => {
      await expectGatewayToEquals(expectedSubscription)
    })
  })

  describe('Customer subscription', () => {
    beforeEach(async () => {
      givenExistingCustomers(JSON.parse(JSON.stringify(lucasLefevre)))
      uuid = 'user-uuid'
      uuidGenerator.setNext(uuid)
      now = 123456789
      dateProvider.feedWith(now)
      dto = { email: lucasLefevre.email, customerUuid: lucasLefevre.uuid }
      await whenSubscribeToNewsletter()
      expectedSubscription = {
        uuid,
        email: dto.email,
        customerUuid: dto.customerUuid,
        subscribedAt: now
      }
    })
    it('should save in store', () => {
      expectStoreToEquals(expectedSubscription)
    })
    it('should save in gateway', async () => {
      await expectGatewayToEquals(expectedSubscription)
    })
    it('should update the customer in store', () => {
      expect(customerStore.items).toStrictEqual([
        {
          ...lucasLefevre,
          newsletterSubscription: expectedSubscription
        }
      ])
    })
  })

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerGateway.feedWith(...customers)
    customerStore.items = customers
  }

  const whenSubscribeToNewsletter = async () => {
    await subscribeToNewsletter(dto, newsletterGateway, customerGateway)
  }

  const expectStoreToEquals = (
    ...subscriptions: Array<NewsletterSubscription>
  ) => {
    expect(newsletterStore.items).toStrictEqual(subscriptions)
  }

  const expectGatewayToEquals = async (
    ...subscriptions: Array<NewsletterSubscription>
  ) => {
    expect(await newsletterGateway.list()).toStrictEqual(subscriptions)
  }
})
