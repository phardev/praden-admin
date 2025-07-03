import { NewsletterSubscription } from '@core/entities/newsletterSubscription'
import { SubscribeToNewsletterDTO } from '@core/usecases/newsletter-subscriptions/subscribe-to-newsletter/subscribeToNewsletter'

export interface NewsletterGateway {
  list(): Promise<Array<NewsletterSubscription>>
  subscribe(dto: SubscribeToNewsletterDTO): Promise<NewsletterSubscription>
  unsubscribe(email: string): Promise<NewsletterSubscription>
}
