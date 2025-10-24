import { NewsletterSubscription } from '@core/entities/newsletterSubscription'
import { DateProvider } from '@core/gateways/dateProvider'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { SubscribeToNewsletterDTO } from '@core/usecases/newsletter-subscriptions/subscribe-to-newsletter/subscribeToNewsletter'
import { NewsletterGateway } from '../../../core/gateways/newsletterGateway'

export class InMemoryNewsletterGateway implements NewsletterGateway {
  private subscriptions: Array<NewsletterSubscription> = []
  private uuidGenerator: UuidGenerator
  private dateProvider: DateProvider

  constructor(uuidGenerator: UuidGenerator, dateProvider: DateProvider) {
    this.uuidGenerator = uuidGenerator
    this.dateProvider = dateProvider
  }

  list(): Promise<Array<NewsletterSubscription>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.subscriptions)))
  }

  subscribe(dto: SubscribeToNewsletterDTO): Promise<NewsletterSubscription> {
    const subscription: NewsletterSubscription = {
      uuid: this.uuidGenerator.generate(),
      email: dto.email,
      subscribedAt: this.dateProvider.now()
    }
    if (dto.customerUuid) {
      subscription.customerUuid = dto.customerUuid
    }
    this.subscriptions.push(subscription)
    return Promise.resolve(subscription)
  }

  unsubscribe(email: string): Promise<NewsletterSubscription> {
    const subscription = this.subscriptions.find((s) => s.email === email)
    if (!subscription) {
      throw new Error('Subscription not found')
    }
    this.subscriptions = this.subscriptions.filter((s) => s.email !== email)
    return Promise.resolve(subscription)
  }

  feedWith(...subscriptions: Array<NewsletterSubscription>) {
    this.subscriptions = subscriptions
  }
}
