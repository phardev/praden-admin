import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { Laboratory } from '@core/entities/laboratory'
import { LaboratoryGateway } from '@core/gateways/laboratoryGateway'
import { UUID } from '@core/types/types'
import { CreateLaboratoryDTO } from '@core/usecases/laboratories/laboratory-creation/createLaboratory'
import { EditLaboratoryDTO } from '@core/usecases/laboratories/laboratory-edition/editLaboratory'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealLaboratoryGateway
  extends RealGateway
  implements LaboratoryGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Laboratory>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/laboratories`)
    return res.data.items.sort((a: Laboratory, b: Laboratory) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })
  }
  async getByUuid(uuid: UUID): Promise<Laboratory> {
    const res = await axiosWithBearer.get(
      `${this.baseUrl}/laboratories/${uuid}`
    )
    return res.data.item
  }
  async create(dto: CreateLaboratoryDTO): Promise<Laboratory> {
    const formData = this.createFormData(dto)
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/laboratories`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return res.data.item
  }
  async edit(uuid: UUID, dto: EditLaboratoryDTO): Promise<Laboratory> {
    const formData = this.createFormData(dto)
    formData.append('uuid', uuid)
    const res = await axiosWithBearer.patch(
      `${this.baseUrl}/laboratories/edit/${uuid}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return res.data.item
  }
}
