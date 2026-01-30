import type { Mail, UUID } from '@core/types/types'
import type { LoyaltyTransaction } from './loyaltyTransaction'
import type { NewsletterSubscription } from './newsletterSubscription'

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
  loyaltyPointsBalance: number
  loyaltyPointsHistory?: Array<LoyaltyTransaction>
}
