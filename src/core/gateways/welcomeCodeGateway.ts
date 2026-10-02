import { WelcomeCode, WelcomeCodeDTO } from '@core/entities/welcomeCode'
import { UUID } from '@core/types/types'

export interface WelcomeCodeGateway {
  list(): Promise<Array<WelcomeCode>>
  create(dto: WelcomeCodeDTO): Promise<void>
  edit(uuid: UUID, dto: WelcomeCodeDTO): Promise<void>
  enable(uuid: UUID): Promise<void>
  disable(uuid: UUID): Promise<void>
}
