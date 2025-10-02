import { NewsletterGateway } from '@core/gateways/newsletterGateway'
import { RealGateway } from '../order-gateways/RealOrderGateway'
import { NewsletterSubscription } from '@core/entities/newsletterSubscription'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { SubscribeToNewsletterDTO } from '@core/usecases/newsletter-subscriptions/subscribe-to-newsletter/subscribeToNewsletter'

export class RealNewsletterGateway
  extends RealGateway
  implements NewsletterGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<NewsletterSubscription>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/newsletters`)
    return res.data
  }

  async subscribe(
    dto: SubscribeToNewsletterDTO
  ): Promise<NewsletterSubscription> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/newsletters/subscribe`,
      dto
    )
    return res.data
  }

  async unsubscribe(email: string): Promise<NewsletterSubscription> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/newsletters/unsubscribe`,
      { email }
    )
    return res.data
  }
}
