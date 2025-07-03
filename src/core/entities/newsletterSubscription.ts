import { Timestamp } from '@core/types/types'

export interface NewsletterSubscription {
  uuid: string
  email: string
  customerUuid?: string
  subscribedAt: Timestamp
}
