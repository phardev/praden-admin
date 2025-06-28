import { Mail, UUID } from '@core/types/types'
import { NewsletterSubscription } from './newsletterSubscription'

export interface Customer {
  uuid: UUID
  firstname: string
  lastname: string
  email: Mail
  phone: string
  ordersCount: number
  ordersTotal: number
  newsletterSubscription?: NewsletterSubscription
}
