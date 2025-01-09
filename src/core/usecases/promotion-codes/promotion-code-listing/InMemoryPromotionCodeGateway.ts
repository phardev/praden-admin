import { PromotionCode } from './promotionCode'
import { PromotionCodeGateway } from './promotionCodeGateway'
import { PromotionCodeDoesNotExistsError } from '@core/errors/PromotionCodeDoesNotExistsError'

export class InMemoryPromotionCodeGateway implements PromotionCodeGateway {
  private promotionCodes: Array<PromotionCode> = []

  list(): Promise<Array<PromotionCode>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.promotionCodes)))
  }

  getByCode(code: string): Promise<PromotionCode> {
    const promotionCode = this.promotionCodes.find((pc) => pc.code === code)
    if (!promotionCode) {
      throw new PromotionCodeDoesNotExistsError(code)
    }
    return Promise.resolve(JSON.parse(JSON.stringify(promotionCode)))
  }

  feedWith(...promotionCodes: Array<PromotionCode>) {
    this.promotionCodes = promotionCodes
  }
}
