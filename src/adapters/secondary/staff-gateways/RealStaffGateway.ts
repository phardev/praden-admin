import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import {
  StaffGateway,
  CreateStaffDTO,
  EditStaffDTO
} from '@core/gateways/staffGateway'
import { Staff } from '@core/entities/staff'
import { UUID } from '@core/types/types'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealStaffGateway extends RealGateway implements StaffGateway {
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async list(): Promise<Array<Staff>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/staff`)
    return res.data.items
  }

  async create(dto: CreateStaffDTO): Promise<Staff> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/staff`, dto)
    return res.data.item
  }

  async edit(uuid: UUID, dto: EditStaffDTO): Promise<Staff> {
    const res = await axiosWithBearer.put(`${this.baseUrl}/staff/${uuid}`, dto)
    return res.data.item
  }

  async assignRole(staffUuid: UUID, roleUuid: UUID): Promise<Staff> {
    const res = await axiosWithBearer.put(
      `${this.baseUrl}/staff/${staffUuid}/assign-role`,
      { roleUuid }
    )
    return res.data.item
  }
}
