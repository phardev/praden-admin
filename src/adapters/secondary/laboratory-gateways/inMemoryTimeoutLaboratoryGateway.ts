import { InMemoryLaboratoryGateway } from '@adapters/secondary/laboratory-gateways/inMemoryLaboratoryGateway'
import { Laboratory } from '@core/entities/laboratory'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { CreateLaboratoryDTO } from '@core/usecases/laboratories/laboratory-creation/createLaboratory'
import { EditLaboratoryDTO } from '@core/usecases/laboratories/laboratory-edition/editLaboratory'

export class InMemoryTimeoutLaboratoryGateway extends InMemoryLaboratoryGateway {
  private readonly timeoutInMs: number

  constructor(timeoutInMs: number, uuidGenerator: UuidGenerator) {
    super(uuidGenerator)
    this.timeoutInMs = timeoutInMs
  }

  override list(): Promise<Array<Laboratory>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.list())
      }, this.timeoutInMs)
    })
  }

  override getByUuid(uuid: UUID): Promise<Laboratory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByUuid(uuid))
      }, this.timeoutInMs)
    })
  }

  override async create(dto: CreateLaboratoryDTO): Promise<Laboratory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.create(dto))
      }, this.timeoutInMs)
    })
  }

  override async edit(uuid: UUID, dto: EditLaboratoryDTO): Promise<Laboratory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.edit(uuid, dto))
      }, this.timeoutInMs)
    })
  }
}
