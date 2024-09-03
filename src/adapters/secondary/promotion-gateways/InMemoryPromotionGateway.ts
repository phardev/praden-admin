import { PromotionGateway } from '@core/gateways/promotionGateway'
import {
  CreatePromotionDTO,
  EditPromotionDTO,
  Promotion
} from '@core/entities/promotion'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'

import { PromotionDoesNotExistsError } from '@core/errors/PromotionDoesNotExistsError'

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

  edit(uuid: UUID, promotion: Partial<EditPromotionDTO>): Promise<Promotion> {
    const index = this.promotions.findIndex((p) => p.uuid === uuid)
    if (index < 0) throw new PromotionDoesNotExistsError(uuid)
    this.promotions[index] = Object.assign(this.promotions[index], promotion)
    return Promise.resolve(this.promotions[index])
  }

  getByUuid(uuid: UUID): Promise<Promotion> {
    const res = this.promotions.find((p) => p.uuid === uuid)
    if (!res) throw new PromotionDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  getPromotionsForProduct(
    productUUID: UUID
  ): Promise<Array<Promotion> | undefined> {
    const res = this.promotions.filter((p) =>
      p.products.map((product) => product.uuid).includes(productUUID)
    )
    return Promise.resolve(res)
  }

  feedWith(...promotions: Array<Promotion>) {
    this.promotions = promotions
  }
}
