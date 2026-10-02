import {
  WelcomeCode,
  WelcomeCodeDTO,
  WelcomeCodeStatus
} from '@core/entities/welcomeCode'
import {
  WelcomeCodeError,
  WelcomeCodeErrorCode
} from '@core/errors/WelcomeCodeError'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { WelcomeCodeGateway } from '@core/gateways/welcomeCodeGateway'
import { UUID } from '@core/types/types'

const copyOf = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export class InMemoryWelcomeCodeGateway implements WelcomeCodeGateway {
  private welcomeCodes: Array<WelcomeCode> = []
  private promotionCodes: Array<string> = []
  private readonly uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(): Promise<Array<WelcomeCode>> {
    return Promise.resolve(copyOf(this.welcomeCodes))
  }

  async create(dto: WelcomeCodeDTO): Promise<void> {
    this.verifyThatCodeIsFree(dto.code)
    this.welcomeCodes.push({
      uuid: this.uuidGenerator.generate(),
      ...copyOf(dto),
      isActive: true,
      sentCount: 0,
      usedCount: 0,
      status: WelcomeCodeStatus.Usable
    })
  }

  async edit(uuid: UUID, dto: WelcomeCodeDTO): Promise<void> {
    const {
      uuid: _uuid,
      isActive,
      sentCount,
      usedCount,
      status
    } = this.findByUuid(uuid)
    this.verifyThatCodeIsFree(dto.code, uuid)
    this.replace({
      uuid,
      ...copyOf(dto),
      isActive,
      sentCount,
      usedCount,
      status
    })
  }

  async enable(uuid: UUID): Promise<void> {
    this.replace({
      ...this.findByUuid(uuid),
      isActive: true,
      status: WelcomeCodeStatus.Usable
    })
  }

  async disable(uuid: UUID): Promise<void> {
    this.replace({
      ...this.findByUuid(uuid),
      isActive: false,
      status: WelcomeCodeStatus.Disabled
    })
  }

  feedWith(...welcomeCodes: Array<WelcomeCode>) {
    this.welcomeCodes = copyOf(welcomeCodes)
  }

  feedPromotionCodesWith(...codes: Array<string>) {
    this.promotionCodes = codes
  }

  private replace(welcomeCode: WelcomeCode) {
    this.welcomeCodes = this.welcomeCodes.map((w) =>
      w.uuid === welcomeCode.uuid ? welcomeCode : w
    )
  }

  private findByUuid(uuid: UUID): WelcomeCode {
    const welcomeCode = this.welcomeCodes.find((w) => w.uuid === uuid)
    if (!welcomeCode) {
      throw new WelcomeCodeError(WelcomeCodeErrorCode.NotFound, uuid)
    }
    return welcomeCode
  }

  private verifyThatCodeIsFree(code: string, ownerUuid?: UUID) {
    if (
      this.welcomeCodes.some((w) => w.code === code && w.uuid !== ownerUuid)
    ) {
      throw new WelcomeCodeError(
        WelcomeCodeErrorCode.CodeTakenByWelcomeCode,
        code
      )
    }
    if (this.promotionCodes.includes(code)) {
      throw new WelcomeCodeError(
        WelcomeCodeErrorCode.CodeTakenByPromotionCode,
        code
      )
    }
  }
}
