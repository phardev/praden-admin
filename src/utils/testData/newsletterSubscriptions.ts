import { NewsletterSubscription } from '@core/entities/newsletterSubscription'

export const elodieDurandNewsletterSubscription: NewsletterSubscription = {
  uuid: 'newsletter-subscription-elodiedurand',
  email: 'elodie.durand@example.com',
  customerUuid: 'customer-elodiedurand',
  subscribedAt: 1674371259000
}

export const guestNewsletterSubscription: NewsletterSubscription = {
  uuid: 'newsletter-subscription-guest',
  email: 'guest@example.com',
  subscribedAt: 1674371259000
}
