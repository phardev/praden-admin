import { PromotionGateway } from '@core/usecases/promotions/promotions-listing/promotionGateway'
import {
  CreatePromotionDTO,
  Promotion
} from '@core/usecases/promotions/promotions-listing/promotion'
import { UuidGenerator } from '@core/gateways/uuidGenerator'

export class InMemoryPromotionGateway implements PromotionGateway {
  private promotions: Array<Promotion> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(): Promise<Array<Promotion>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.promotions)))
  }

  create(promotion: CreatePromotionDTO): Promise<Promotion> {
    const p: Promotion = {
      ...promotion,
      uuid: this.uuidGenerator.generate()
    }
    this.promotions.push(p)
    return Promise.resolve(p)
  }

  feedWith(...promotions: Array<Promotion>) {
    this.promotions = promotions
  }
}
