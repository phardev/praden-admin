import type { NewsletterUnsubscriptionImport } from '@core/entities/newsletterUnsubscriptionImport'
import { useNewsletterStore } from '@store/newsletterStore'
import {
  elodieDurandNewsletterSubscription,
  guestNewsletterSubscription
} from '@utils/testData/newsletterSubscriptions'
import { createPinia, setActivePinia } from 'pinia'
import { selectNewsletterUnsubscriptionColumn } from './selectNewsletterUnsubscriptionColumn'

describe('Select newsletter unsubscription column', () => {
  let newsletterStore: ReturnType<typeof useNewsletterStore>
  const unsubscriptionImport: NewsletterUnsubscriptionImport = {
    fileName: 'unsubscriptions.csv',
    columns: [
      { position: 1, emails: [elodieDurandNewsletterSubscription.email] },
      { position: 2, emails: [guestNewsletterSubscription.email] }
    ],
    selectedPosition: 1,
    isUnsubscribing: false
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    newsletterStore = useNewsletterStore()
  })

  it('should select the given column', () => {
    newsletterStore.unsubscriptionImport = JSON.parse(
      JSON.stringify(unsubscriptionImport)
    )
    const otherPosition = unsubscriptionImport.columns[1].position
    selectNewsletterUnsubscriptionColumn(otherPosition)
    expect(newsletterStore.unsubscriptionImport).toStrictEqual({
      ...unsubscriptionImport,
      selectedPosition: otherPosition
    })
  })

  it('should do nothing when no import is in progress', () => {
    selectNewsletterUnsubscriptionColumn(1)
    expect(newsletterStore.unsubscriptionImport).toBeUndefined()
  })
})
