import { LaboratoryGateway } from '@core/gateways/laboratoryGateway'
import { RealGateway } from '../order-gateways/RealOrderGateway'
import { Laboratory } from '@core/entities/laboratory'
import { UUID } from '@core/types/types'
import { CreateLaboratoryDTO } from '@core/usecases/laboratories/laboratory-creation/createLaboratory'
import { EditLaboratoryDTO } from '@core/usecases/laboratories/laboratory-edition/editLaboratory'
import axios from 'axios'

export class RealLaboratoryGateway
  extends RealGateway
  implements LaboratoryGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Laboratory>> {
    const res = await axios.get(`${this.baseUrl}/laboratories`)
    return res.data.items
  }
  async getByUuid(uuid: UUID): Promise<Laboratory> {
    const res = await axios.get(`${this.baseUrl}/laboratories/${uuid}`)
    return res.data.item
  }
  create(dto: CreateLaboratoryDTO): Promise<Laboratory> {
    throw new Error('Method not implemented.')
  }
  edit(uuid: UUID, dto: EditLaboratoryDTO): Promise<Laboratory> {
    throw new Error('Method not implemented.')
  }
}
