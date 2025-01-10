import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { CreatePromotionCodeDTO, PromotionCode } from './promotionCode'
import { PromotionCodeGateway } from './promotionCodeGateway'
import { PromotionCodeDoesNotExistsError } from '@core/errors/PromotionCodeDoesNotExistsError'

export class InMemoryPromotionCodeGateway implements PromotionCodeGateway {
  private promotionCodes: Array<PromotionCode> = []
  private readonly uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

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

  create(dto: CreatePromotionCodeDTO): Promise<PromotionCode> {
    const created: PromotionCode = {
      ...dto,
      uuid: this.uuidGenerator.generate(),
      currentUses: 0
    }
    this.promotionCodes.push(created)
    return Promise.resolve(JSON.parse(JSON.stringify(created)))
  }

  feedWith(...promotionCodes: Array<PromotionCode>) {
    this.promotionCodes = promotionCodes
  }
}
