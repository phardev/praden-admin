import { InMemoryCustomerGateway } from '@adapters/secondary/customer-gateways/inMemoryCustomerGateway'
import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryNewsletterGateway } from '@adapters/secondary/newsletter-gateways/inMemoryNewsletterGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { Customer } from '@core/entities/customer'
import { NewsletterSubscription } from '@core/entities/newsletterSubscription'
import { useCustomerStore } from '@store/customerStore'
import { useNewsletterStore } from '@store/newsletterStore'
import { elodieDurand } from '@utils/testData/customers'
import {
  elodieDurandNewsletterSubscription,
  guestNewsletterSubscription
} from '@utils/testData/newsletterSubscriptions'
import { createPinia, setActivePinia } from 'pinia'
import { unsubscribeFromNewsletter } from './unsubscribe-from-newsletter'

describe('Unsubscribe from newsletter', () => {
  let newsletterStore: any
  let newsletterGateway: InMemoryNewsletterGateway
  let customerStore: any
  let customerGateway: InMemoryCustomerGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    newsletterStore = useNewsletterStore()
    newsletterGateway = new InMemoryNewsletterGateway(
      new FakeUuidGenerator(),
      new FakeDateProvider()
    )
    customerGateway = new InMemoryCustomerGateway(new FakeUuidGenerator())
    customerStore = useCustomerStore()
  })

  describe('Guest unsubscription', () => {
    beforeEach(async () => {
      givenExistingNewsletterSubscriptions(
        elodieDurandNewsletterSubscription,
        guestNewsletterSubscription
      )
      await whenUnsubscribeFromNewsletter(guestNewsletterSubscription.email)
    })
    it('should remove from store', () => {
      expectStoreToEquals(elodieDurandNewsletterSubscription)
    })
    it('should remove from gateway', () => {
      expectGatewayToEquals(elodieDurandNewsletterSubscription)
    })
  })

  describe('Customer unsubscription', () => {
    beforeEach(async () => {
      givenExistingNewsletterSubscriptions(
        elodieDurandNewsletterSubscription,
        guestNewsletterSubscription
      )
      givenExistingCustomers(elodieDurand)
      await whenUnsubscribeFromNewsletter(
        elodieDurandNewsletterSubscription.email
      )
    })
    it('should remove from store', () => {
      expectStoreToEquals(guestNewsletterSubscription)
    })
    it('should remove from gateway', () => {
      expectGatewayToEquals(guestNewsletterSubscription)
    })
    it('should remove customer subscription', () => {
      const expectedCustomer = JSON.parse(JSON.stringify(elodieDurand))
      delete expectedCustomer.newsletterSubscription
      expect(customerStore.items).toStrictEqual([expectedCustomer])
    })
  })

  const givenExistingCustomers = (...customers: Array<Customer>) => {
    customerGateway.feedWith(...customers)
    customerStore.items = customers
  }

  const givenExistingNewsletterSubscriptions = (
    ...subscriptions: Array<NewsletterSubscription>
  ) => {
    newsletterGateway.feedWith(...subscriptions)
    newsletterStore.items = subscriptions
  }

  const whenUnsubscribeFromNewsletter = async (email: string) => {
    await unsubscribeFromNewsletter(email, newsletterGateway, customerGateway)
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
