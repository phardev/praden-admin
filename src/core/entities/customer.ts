import { Mail, UUID } from '@core/types/types'
import type { CustomerLoyalty } from './loyaltyPointsTransaction'
import { NewsletterSubscription } from './newsletterSubscription'

export interface Customer {
  uuid: UUID
  firstname: string
  lastname: string
  email: Mail
  phone: string
  ordersCount: number
  ordersTotal: number
  lastOrderDate?: Date | string
  newsletterSubscription?: NewsletterSubscription
  loyalty?: CustomerLoyalty
}
