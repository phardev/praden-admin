import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { CreatePromotionCodeDTO, PromotionCode } from './promotionCode'
import { PromotionCodeGateway } from './promotionCodeGateway'
import { PromotionCodeDoesNotExistsError } from '@core/errors/PromotionCodeDoesNotExistsError'
import { EditPromotionCodeDTO } from '@core/usecases/promotion-codes/promotion-code-edition/editPromotionCode'
import { PromotionCodeWithSameCodeAlreadyExistsError } from '@core/errors/PromotionCodeWithSameCodeAlreadyExistsError'

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
    this.verifyThatPromotionCodeWithSameCodeDoesNotAlreadyExists(dto.code)
    const created: PromotionCode = {
      ...dto,
      uuid: this.uuidGenerator.generate(),
      currentUses: 0
    }
    this.promotionCodes.push(created)
    return Promise.resolve(JSON.parse(JSON.stringify(created)))
  }

  edit(code: string, dto: EditPromotionCodeDTO): Promise<PromotionCode> {
    const index = this.promotionCodes.findIndex((pc) => pc.code === code)
    if (index < 0) {
      throw new PromotionCodeDoesNotExistsError(code)
    }
    this.verifyThatPromotionCodeWithSameCodeDoesNotAlreadyExists(dto.code)
    this.promotionCodes[index] = Object.assign(this.promotionCodes[index], dto)
    return Promise.resolve(
      JSON.parse(JSON.stringify(this.promotionCodes[index]))
    )
  }

  private verifyThatPromotionCodeWithSameCodeDoesNotAlreadyExists(
    code: string
  ) {
    const promotionCode = this.promotionCodes.find((pc) => pc.code === code)
    if (promotionCode) {
      throw new PromotionCodeWithSameCodeAlreadyExistsError(code)
    }
  }

  feedWith(...promotionCodes: Array<PromotionCode>) {
    this.promotionCodes = promotionCodes
  }
}
