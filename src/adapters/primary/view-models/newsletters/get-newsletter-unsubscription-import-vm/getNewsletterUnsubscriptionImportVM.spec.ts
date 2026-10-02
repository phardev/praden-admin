import type { NewsletterUnsubscriptionImport } from '@core/entities/newsletterUnsubscriptionImport'
import { useNewsletterStore } from '@store/newsletterStore'
import {
  elodieDurandNewsletterSubscription,
  guestNewsletterSubscription
} from '@utils/testData/newsletterSubscriptions'
import { createPinia, setActivePinia } from 'pinia'
import {
  EMAILS_SAMPLE_SIZE,
  type GetNewsletterUnsubscriptionImportVM,
  getNewsletterUnsubscriptionImportVM
} from './getNewsletterUnsubscriptionImportVM'

describe('Get newsletter unsubscription import VM', () => {
  let newsletterStore: ReturnType<typeof useNewsletterStore>
  const sender = 'contact@pharmacie.example.com'
  const fileName = 'unsubscriptions.csv'
  const recipients = [
    elodieDurandNewsletterSubscription.email,
    guestNewsletterSubscription.email
  ]
  const notStartedVM: GetNewsletterUnsubscriptionImportVM = {
    isStarted: false,
    fileName: '',
    hasNoEmail: false,
    columns: [],
    canChooseColumn: false,
    selectedPosition: undefined,
    emailsCount: 0,
    emailsSample: [],
    otherEmailsCount: 0,
    isUnsubscribing: false,
    processedCount: 0,
    canUnsubscribe: false,
    result: undefined
  }
  const singleColumnImport: NewsletterUnsubscriptionImport = {
    fileName,
    columns: [{ position: 2, name: 'email', emails: recipients }],
    selectedPosition: 2,
    isUnsubscribing: false
  }
  const singleColumnVM: GetNewsletterUnsubscriptionImportVM = {
    ...notStartedVM,
    isStarted: true,
    fileName,
    columns: [{ position: 2, name: 'email', emailsCount: recipients.length }],
    selectedPosition: 2,
    emailsCount: recipients.length,
    emailsSample: recipients,
    canUnsubscribe: true
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    newsletterStore = useNewsletterStore()
  })

  describe('No import is in progress', () => {
    it('should not be started', () => {
      expect(getNewsletterUnsubscriptionImportVM()).toStrictEqual(notStartedVM)
    })
  })

  describe('The file has a single email column', () => {
    it('should be ready to unsubscribe its emails', () => {
      newsletterStore.unsubscriptionImport = singleColumnImport
      expect(getNewsletterUnsubscriptionImportVM()).toStrictEqual(
        singleColumnVM
      )
    })
  })

  describe('The file has several columns holding many emails', () => {
    it('should let the user choose the column', () => {
      const otherEmails = ['other1@example.com', 'other2@example.com']
      newsletterStore.unsubscriptionImport = {
        fileName,
        columns: [
          { position: 1, name: 'Email', emails: recipients },
          { position: 5, emails: otherEmails }
        ],
        selectedPosition: 5,
        isUnsubscribing: false
      }
      expect(getNewsletterUnsubscriptionImportVM()).toStrictEqual({
        ...notStartedVM,
        isStarted: true,
        fileName,
        columns: [
          { position: 1, name: 'Email', emailsCount: recipients.length },
          { position: 5, name: undefined, emailsCount: otherEmails.length }
        ],
        canChooseColumn: true,
        selectedPosition: 5,
        emailsCount: otherEmails.length,
        emailsSample: otherEmails,
        canUnsubscribe: true
      })
    })
  })

  describe('The other column only holds a single email', () => {
    it('should not offer to choose the column', () => {
      newsletterStore.unsubscriptionImport = {
        fileName,
        columns: [
          { position: 1, name: 'Email', emails: recipients },
          { position: 5, name: 'Sender', emails: [sender] }
        ],
        selectedPosition: 1,
        isUnsubscribing: false
      }
      expect(getNewsletterUnsubscriptionImportVM()).toStrictEqual({
        ...singleColumnVM,
        columns: [
          { position: 1, name: 'Email', emailsCount: recipients.length }
        ],
        selectedPosition: 1
      })
    })
  })

  describe('The file has more emails than the sample size', () => {
    it('should show the first ones and count the others', () => {
      const emails = Array.from(
        { length: EMAILS_SAMPLE_SIZE + 2 },
        (_, index) => `customer${index}@example.com`
      )
      newsletterStore.unsubscriptionImport = {
        fileName,
        columns: [{ position: 1, emails }],
        selectedPosition: 1,
        isUnsubscribing: false
      }
      expect(getNewsletterUnsubscriptionImportVM()).toStrictEqual({
        ...notStartedVM,
        isStarted: true,
        fileName,
        columns: [{ position: 1, name: undefined, emailsCount: emails.length }],
        selectedPosition: 1,
        emailsCount: emails.length,
        emailsSample: emails.slice(0, EMAILS_SAMPLE_SIZE),
        otherEmailsCount: emails.length - EMAILS_SAMPLE_SIZE,
        canUnsubscribe: true
      })
    })
  })

  describe('The file contains no email', () => {
    it('should warn and prevent unsubscribing', () => {
      newsletterStore.unsubscriptionImport = {
        fileName,
        columns: [],
        isUnsubscribing: false
      }
      expect(getNewsletterUnsubscriptionImportVM()).toStrictEqual({
        ...notStartedVM,
        isStarted: true,
        fileName,
        hasNoEmail: true
      })
    })
  })

  describe('The unsubscription is in progress', () => {
    it('should show the progress and prevent unsubscribing again', () => {
      const processedCount = recipients.length - 1
      newsletterStore.unsubscriptionImport = {
        ...singleColumnImport,
        isUnsubscribing: true,
        progress: {
          submittedCount: recipients.length,
          processedCount,
          unsubscribedCount: 0
        }
      }
      expect(getNewsletterUnsubscriptionImportVM()).toStrictEqual({
        ...singleColumnVM,
        isUnsubscribing: true,
        processedCount,
        canUnsubscribe: false
      })
    })
  })

  describe('The unsubscription stopped before the end', () => {
    it('should allow to resume it', () => {
      const processedCount = recipients.length - 1
      newsletterStore.unsubscriptionImport = {
        ...singleColumnImport,
        progress: {
          submittedCount: recipients.length,
          processedCount,
          unsubscribedCount: processedCount
        }
      }
      expect(getNewsletterUnsubscriptionImportVM()).toStrictEqual({
        ...singleColumnVM,
        processedCount
      })
    })
  })

  describe('The unsubscription is done', () => {
    it('should show how many emails were unsubscribed and how many were not subscribed', () => {
      const unsubscribedCount = 1
      newsletterStore.unsubscriptionImport = {
        ...singleColumnImport,
        progress: {
          submittedCount: recipients.length,
          processedCount: recipients.length,
          unsubscribedCount
        }
      }
      expect(getNewsletterUnsubscriptionImportVM()).toStrictEqual({
        ...singleColumnVM,
        processedCount: recipients.length,
        canUnsubscribe: false,
        result: {
          unsubscribedCount,
          notSubscribedCount: recipients.length - unsubscribedCount
        }
      })
    })
  })
})
