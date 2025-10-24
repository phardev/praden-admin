import { useNewsletterStore } from '@store/newsletterStore'
import {
  elodieDurandNewsletterSubscription,
  guestNewsletterSubscription
} from '@utils/testData/newsletterSubscriptions'
import { createPinia, setActivePinia } from 'pinia'
import { Header } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import {
  GetNewsletterSubscriptionsVM,
  getNewsletterSubscriptionsVM
} from './getNewsletterSubscriptionsVM'

describe('Get products VM', () => {
  let newsletterStore: any
  let expectedVM: Partial<GetNewsletterSubscriptionsVM>

  const expectedHeaders: Array<Header> = [
    {
      name: 'Email',
      value: 'email'
    },
    {
      name: "Date d'inscription",
      value: 'subscribedAt'
    }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    newsletterStore = useNewsletterStore()
  })

  describe('There is no subscription', () => {
    it('should list nothing', () => {
      expectedVM = {
        headers: expectedHeaders,
        items: [],
        currentSearch: undefined
      }
      expectVMToMatch(expectedVM)
    })
  })

  describe('There is some subscriptions', () => {
    it('should list all of them', () => {
      newsletterStore.items = [
        elodieDurandNewsletterSubscription,
        guestNewsletterSubscription
      ]
      expectedVM = {
        items: [
          {
            uuid: elodieDurandNewsletterSubscription.uuid,
            email: elodieDurandNewsletterSubscription.email,
            subscribedAt: '22 janv. 2023'
          },
          {
            uuid: guestNewsletterSubscription.uuid,
            email: guestNewsletterSubscription.email,
            subscribedAt: '22 janv. 2023'
          }
        ]
      }
      expectVMToMatch(expectedVM)
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', () => {
      newsletterStore.isLoading = true
      expectedVM = {
        isLoading: true
      }
      expectVMToMatch(expectedVM)
    })
  })

  const expectVMToMatch = (
    expectedVM: Partial<GetNewsletterSubscriptionsVM>
  ) => {
    const emptyVM: GetNewsletterSubscriptionsVM = {
      headers: expectedHeaders,
      items: [],
      currentSearch: undefined,
      searchError: undefined,
      isLoading: false
    }
    expect(getNewsletterSubscriptionsVM()).toMatchObject({
      ...emptyVM,
      ...expectedVM
    })
  }
})
