import { UUID } from '@core/types/types'
import { Header } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import { useNewsletterStore } from '@store/newsletterStore'
import { timestampToLocaleString } from '@utils/formatters'

export interface GetNewsletterSubscriptionsItemVM {
  uuid: UUID
  email: string
  subscribedAt: string
}

export interface GetNewsletterSubscriptionsVM {
  headers: Array<Header>
  items: Array<GetNewsletterSubscriptionsItemVM>
  currentSearch: undefined
  searchError: string | undefined
  isLoading: boolean
}

export const getNewsletterSubscriptionsVM =
  (): GetNewsletterSubscriptionsVM => {
    const headers: Array<Header> = [
      {
        name: 'Email',
        value: 'email'
      },
      {
        name: "Date d'inscription",
        value: 'subscribedAt'
      }
    ]
    const newsletterStore = useNewsletterStore()
    const res = {
      headers,
      items: newsletterStore.items.map((s) => {
        return {
          uuid: s.uuid,
          email: s.email,
          subscribedAt: timestampToLocaleString(s.subscribedAt, 'fr-FR')
        }
      }),
      currentSearch: undefined,
      searchError: undefined,
      isLoading: newsletterStore.isLoading
    }
    return res
  }
