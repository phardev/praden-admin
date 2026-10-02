import { useNewsletterStore } from '@store/newsletterStore'
import { guestNewsletterSubscription } from '@utils/testData/newsletterSubscriptions'
import { createPinia, setActivePinia } from 'pinia'
import { closeNewsletterUnsubscriptionImport } from './closeNewsletterUnsubscriptionImport'

describe('Close newsletter unsubscription import', () => {
  it('should forget the import in progress', () => {
    setActivePinia(createPinia())
    const newsletterStore = useNewsletterStore()
    newsletterStore.unsubscriptionImport = {
      fileName: 'unsubscriptions.csv',
      columns: [{ position: 1, emails: [guestNewsletterSubscription.email] }],
      selectedPosition: 1,
      isUnsubscribing: false
    }
    closeNewsletterUnsubscriptionImport()
    expect(newsletterStore.unsubscriptionImport).toBeUndefined()
  })
})
