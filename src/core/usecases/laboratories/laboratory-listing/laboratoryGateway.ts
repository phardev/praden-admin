import { UUID } from '@core/types/types'
import { Laboratory } from '@core/usecases/laboratories/laboratory-listing/laboratory'
import { CreateLaboratoryDTO } from '@core/usecases/laboratories/laboratory-creation/createLaboratory'
import { EditLaboratoryDTO } from '../laboratory-edition/editLaboratory'

export interface LaboratoryGateway {
  list(): Promise<Array<Laboratory>>
  getByUuid(uuid: UUID): Promise<Laboratory>
  create(dto: CreateLaboratoryDTO): Promise<Laboratory>
  edit(uuid: UUID, dto: EditLaboratoryDTO): Promise<Laboratory>
}
