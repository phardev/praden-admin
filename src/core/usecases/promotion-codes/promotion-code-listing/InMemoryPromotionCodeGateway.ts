import { PromotionCode } from './promotionCode'
import { PromotionCodeGateway } from './promotionCodeGateway'

export class InMemoryPromotionCodeGateway implements PromotionCodeGateway {
  private promotionCodes: Array<PromotionCode> = []

  list(): Promise<Array<PromotionCode>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.promotionCodes)))
  }

  feedWith(...promotionCodes: Array<PromotionCode>) {
    this.promotionCodes = promotionCodes
  }
}
