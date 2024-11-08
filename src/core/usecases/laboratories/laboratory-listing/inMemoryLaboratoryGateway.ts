import { LaboratoryGateway } from '@core/usecases/laboratories/laboratory-listing/laboratoryGateway'
import { Laboratory } from '@core/usecases/laboratories/laboratory-listing/laboratory'
import { UUID } from '@core/types/types'
import { LaboratoryDoesNotExistsError } from '@core/errors/LaboratoryDoesNotExistsError'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { CreateLaboratoryDTO } from '../laboratory-creation/createLaboratory'
import { getFileContent } from '@utils/file'
import { EditLaboratoryDTO } from '../laboratory-edition/editLaboratory'

export class InMemoryLaboratoryGateway implements LaboratoryGateway {
  private laboratories: Array<Laboratory> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(): Promise<Array<Laboratory>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.laboratories)))
  }

  getByUuid(uuid: UUID): Promise<Laboratory> {
    const res = this.laboratories.find((c) => c.uuid === uuid)
    if (!res) throw new LaboratoryDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  async create(dto: CreateLaboratoryDTO): Promise<Laboratory> {
    const laboratory: Laboratory = {
      uuid: this.uuidGenerator.generate(),
      name: dto.name,
      description: dto.description
    }
    if (dto.image) {
      laboratory.image = await getFileContent(dto.image)
    }
    if (dto.miniature) {
      laboratory.miniature = await getFileContent(dto.miniature)
    }
    this.laboratories.push(laboratory)
    return Promise.resolve(laboratory)
  }

  async edit(uuid: UUID, dto: EditLaboratoryDTO): Promise<Laboratory> {
    const index = this.laboratories.findIndex((l) => l.uuid === uuid)
    const { newImage, newMiniature, ...laboratoryDto } = dto
    if (newImage) {
      laboratoryDto.image = await getFileContent(newImage)
    }
    if (newMiniature) {
      laboratoryDto.miniature = await getFileContent(newMiniature)
    }
    this.laboratories[index] = Object.assign(
      this.laboratories[index],
      laboratoryDto
    )
    return Promise.resolve(this.laboratories[index])
  }

  feedWith(...laboratories: Array<Laboratory>) {
    this.laboratories = laboratories
  }
}
