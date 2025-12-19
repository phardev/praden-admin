import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryNewsletterGateway } from '@adapters/secondary/newsletter-gateways/inMemoryNewsletterGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { NewsletterSubscription } from '@core/entities/newsletterSubscription'
import { useNewsletterStore } from '@store/newsletterStore'
import {
  elodieDurandNewsletterSubscription,
  guestNewsletterSubscription
} from '@utils/testData/newsletterSubscriptions'
import { createPinia, setActivePinia } from 'pinia'
import { listNewsletterSubscriptions } from './listNewsletterSubscriptions'

describe('Newsletter subscriptions listing', () => {
  let newsletterStore: any
  let newsletterGateway: InMemoryNewsletterGateway
  let uuidGenerator: FakeUuidGenerator
  let dateProvider: FakeDateProvider

  beforeEach(() => {
    setActivePinia(createPinia())
    newsletterStore = useNewsletterStore()
    uuidGenerator = new FakeUuidGenerator()
    dateProvider = new FakeDateProvider()
    newsletterGateway = new InMemoryNewsletterGateway(
      uuidGenerator,
      dateProvider
    )
  })

  describe('There is no newsletter subscription', () => {
    it('should list nothing', async () => {
      await whenListNewsletterSubscriptions()
      expectStoreToEquals()
    })
  })

  describe('There is some newsletter subscriptions', () => {
    beforeEach(async () => {
      givenExistingNewsletterSubscriptions(
        elodieDurandNewsletterSubscription,
        guestNewsletterSubscription
      )
      await whenListNewsletterSubscriptions()
    })
    it('should list all of them', () => {
      expectStoreToEquals(
        elodieDurandNewsletterSubscription,
        guestNewsletterSubscription
      )
    })
  })

  describe('Loading', () => {
    beforeEach(() => {
      givenExistingNewsletterSubscriptions(
        elodieDurandNewsletterSubscription,
        guestNewsletterSubscription
      )
    })
    it('should be aware during loading', async () => {
      const unsubscribe = newsletterStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenListNewsletterSubscriptions()
    })
    it('should be aware that loading is over', async () => {
      await whenListNewsletterSubscriptions()
      expect(newsletterStore.isLoading).toBe(false)
    })
  })

  const givenExistingNewsletterSubscriptions = (
    ...subscriptions: Array<NewsletterSubscription>
  ) => {
    newsletterGateway.feedWith(...subscriptions)
  }

  const whenListNewsletterSubscriptions = async (gateway = newsletterGateway) => {
    await listNewsletterSubscriptions(gateway)
  }
  const expectStoreToEquals = (
    ...subscriptions: Array<NewsletterSubscription>
  ) => {
    expect(newsletterStore.items).toStrictEqual(subscriptions)
  }
})
