import { Laboratory } from '@core/entities/laboratory'
import { UUID } from '@core/types/types'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { CreateLaboratoryDTO } from '@core/usecases/laboratories/laboratory-creation/createLaboratory'
import { EditLaboratoryDTO } from '@core/usecases/laboratories/laboratory-edition/editLaboratory'
import { InMemoryLaboratoryGateway } from '@adapters/secondary/laboratory-gateways/inMemoryLaboratoryGateway'

export class InMemoryTimeoutLaboratoryGateway extends InMemoryLaboratoryGateway {
  private readonly timeoutInMs: number

  constructor(timeoutInMs: number, uuidGenerator: UuidGenerator) {
    super(uuidGenerator)
    this.timeoutInMs = timeoutInMs
  }

  list(): Promise<Array<Laboratory>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.list())
      }, this.timeoutInMs)
    })
  }

  getByUuid(uuid: UUID): Promise<Laboratory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByUuid(uuid))
      }, this.timeoutInMs)
    })
  }

  async create(dto: CreateLaboratoryDTO): Promise<Laboratory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.create(dto))
      }, this.timeoutInMs)
    })
  }

  async edit(uuid: UUID, dto: EditLaboratoryDTO): Promise<Laboratory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.edit(uuid, dto))
      }, this.timeoutInMs)
    })
  }
}
