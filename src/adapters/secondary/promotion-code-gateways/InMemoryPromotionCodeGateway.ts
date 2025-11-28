import { PromotionCodeDoesNotExistsError } from '@core/errors/PromotionCodeDoesNotExistsError'
import { PromotionCodeWithSameCodeAlreadyExistsError } from '@core/errors/PromotionCodeWithSameCodeAlreadyExistsError'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { EditPromotionCodeDTO } from '@core/usecases/promotion-codes/promotion-code-edition/editPromotionCode'
import {
  CreatePromotionCodeDTO,
  PromotionCode
} from '../../../core/entities/promotionCode'
import { PromotionCodeStats } from '../../../core/entities/promotionCodeStats'
import { PromotionCodeGateway } from '../../../core/gateways/promotionCodeGateway'

export class InMemoryPromotionCodeGateway implements PromotionCodeGateway {
  private promotionCodes: Array<PromotionCode> = []
  private stats: Map<string, PromotionCodeStats> = new Map()
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
    if (code !== dto.code) {
      this.verifyThatPromotionCodeWithSameCodeDoesNotAlreadyExists(dto.code!)
    }
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

  async getStats(code: string): Promise<PromotionCodeStats> {
    const stats = this.stats.get(code)
    if (!stats) {
      throw new PromotionCodeDoesNotExistsError(code)
    }
    return Promise.resolve(JSON.parse(JSON.stringify(stats)))
  }

  feedWith(...promotionCodes: Array<PromotionCode>) {
    this.promotionCodes = promotionCodes
  }

  feedStatsFor(code: string, stats: PromotionCodeStats) {
    this.stats.set(code, stats)
  }
}
