import { PromotionGateway } from '@core/usecases/promotions/promotions-listing/promotionGateway'
import { Promotion } from '@core/usecases/promotions/promotions-listing/promotion'

export class InMemoryPromotionGateway implements PromotionGateway {
  private promotions: Array<Promotion> = []

  list(): Promise<Array<Promotion>> {
    return Promise.resolve(this.promotions)
  }

  feedWith(...promotions: Array<Promotion>) {
    this.promotions = promotions
  }
}
