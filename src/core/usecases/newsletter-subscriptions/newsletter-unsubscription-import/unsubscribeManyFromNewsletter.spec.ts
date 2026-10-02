import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { InMemoryNewsletterGateway } from '@adapters/secondary/newsletter-gateways/inMemoryNewsletterGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import type { NewsletterSubscription } from '@core/entities/newsletterSubscription'
import type { NewsletterUnsubscriptionImport } from '@core/entities/newsletterUnsubscriptionImport'
import { useNewsletterStore } from '@store/newsletterStore'
import {
  elodieDurandNewsletterSubscription,
  guestNewsletterSubscription
} from '@utils/testData/newsletterSubscriptions'
import { createPinia, setActivePinia } from 'pinia'
import {
  UNSUBSCRIPTION_BATCH_SIZE,
  unsubscribeManyFromNewsletter
} from './unsubscribeManyFromNewsletter'

class FailingAfterFirstBatchNewsletterGateway extends InMemoryNewsletterGateway {
  private hasSucceededOnce = false

  override unsubscribeMany(emails: Array<string>): Promise<number> {
    if (this.hasSucceededOnce) {
      return Promise.reject(new Error('Network error'))
    }
    this.hasSucceededOnce = true
    return super.unsubscribeMany(emails)
  }
}

describe('Unsubscribe many from newsletter', () => {
  let newsletterStore: ReturnType<typeof useNewsletterStore>
  let newsletterGateway: InMemoryNewsletterGateway
  const unknownEmail = 'unknown@example.com'
  const emails = [guestNewsletterSubscription.email, unknownEmail]
  const unsubscriptionImport: NewsletterUnsubscriptionImport = {
    fileName: 'unsubscriptions.csv',
    columns: [
      { position: 1, emails },
      { position: 2, emails: [elodieDurandNewsletterSubscription.email] }
    ],
    selectedPosition: 1,
    isUnsubscribing: false
  }

  const emptyImport: NewsletterUnsubscriptionImport = {
    fileName: 'unsubscriptions.csv',
    columns: [],
    isUnsubscribing: false
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    newsletterStore = useNewsletterStore()
    newsletterGateway = new InMemoryNewsletterGateway(
      new FakeUuidGenerator(),
      new FakeDateProvider()
    )
    givenExistingNewsletterSubscriptions(
      elodieDurandNewsletterSubscription,
      guestNewsletterSubscription
    )
  })

  describe('An import is ready', () => {
    beforeEach(async () => {
      givenUnsubscriptionImport(unsubscriptionImport)
      await unsubscribeManyFromNewsletter(newsletterGateway)
    })
    it('should unsubscribe the emails of the selected column', async () => {
      expect(await newsletterGateway.list()).toStrictEqual([
        elodieDurandNewsletterSubscription
      ])
    })
    it('should refresh the subscriptions in the store', () => {
      expect(newsletterStore.items).toStrictEqual([
        elodieDurandNewsletterSubscription
      ])
    })
    it('should save the result', () => {
      expect(newsletterStore.unsubscriptionImport).toStrictEqual({
        ...unsubscriptionImport,
        progress: {
          submittedCount: emails.length,
          processedCount: emails.length,
          unsubscribedCount: 1
        }
      })
    })
  })

  describe('No column holds any email', () => {
    it('should unsubscribe nobody', async () => {
      givenUnsubscriptionImport(emptyImport)
      await unsubscribeManyFromNewsletter(newsletterGateway)
      expect(newsletterStore.unsubscriptionImport).toStrictEqual(emptyImport)
    })
  })

  describe('No import is in progress', () => {
    it('should keep every subscription', async () => {
      await unsubscribeManyFromNewsletter(newsletterGateway)
      expect(await newsletterGateway.list()).toStrictEqual([
        elodieDurandNewsletterSubscription,
        guestNewsletterSubscription
      ])
    })
  })

  describe('There are more emails than a batch can hold', () => {
    const unknownEmails = Array.from(
      { length: UNSUBSCRIPTION_BATCH_SIZE },
      (_, index) => `unknown${index}@example.com`
    )
    const manyEmails = [...unknownEmails, guestNewsletterSubscription.email]
    const largeImport: NewsletterUnsubscriptionImport = {
      fileName: 'unsubscriptions.csv',
      columns: [{ position: 1, emails: manyEmails }],
      selectedPosition: 1,
      isUnsubscribing: false
    }
    beforeEach(() => {
      givenUnsubscriptionImport(largeImport)
    })
    it('should process every batch', async () => {
      await unsubscribeManyFromNewsletter(newsletterGateway)
      expect(newsletterStore.unsubscriptionImport).toStrictEqual({
        ...largeImport,
        progress: {
          submittedCount: manyEmails.length,
          processedCount: manyEmails.length,
          unsubscribedCount: 1
        }
      })
    })
    describe('A batch fails', () => {
      it('should throw the error', async () => {
        await expect(
          unsubscribeManyFromNewsletter(failingAfterFirstBatchGateway())
        ).rejects.toThrow('Network error')
      })
      it('should keep the progress of the batches already processed', async () => {
        await unsubscribeManyFromNewsletter(
          failingAfterFirstBatchGateway()
        ).catch(() => {})
        expect(newsletterStore.unsubscriptionImport).toStrictEqual({
          ...largeImport,
          progress: {
            submittedCount: manyEmails.length,
            processedCount: UNSUBSCRIPTION_BATCH_SIZE,
            unsubscribedCount: 0
          }
        })
      })
    })
  })

  const failingAfterFirstBatchGateway = () =>
    new FailingAfterFirstBatchNewsletterGateway(
      new FakeUuidGenerator(),
      new FakeDateProvider()
    )

  const givenExistingNewsletterSubscriptions = (
    ...subscriptions: Array<NewsletterSubscription>
  ) => {
    newsletterGateway.feedWith(...subscriptions)
    newsletterStore.items = subscriptions
  }

  const givenUnsubscriptionImport = (
    existingImport: NewsletterUnsubscriptionImport
  ) => {
    newsletterStore.unsubscriptionImport = JSON.parse(
      JSON.stringify(existingImport)
    )
  }
})
