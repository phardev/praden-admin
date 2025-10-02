import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import {
  RoleGateway,
  EditRoleDTO,
  CreateRoleDTO
} from '@core/gateways/roleGateway'
import { Role } from '@core/entities/role'
import { UUID } from '@core/types/types'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealRoleGateway extends RealGateway implements RoleGateway {
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async list(): Promise<Array<Role>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/roles`)
    return res.data.items
  }

  async reorder(roleUuids: Array<UUID>): Promise<Array<Role>> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/roles/reorder`, {
      uuids: roleUuids
    })
    return res.data.items
  }

  async create(dto: CreateRoleDTO): Promise<Role> {
    const apiPayload = {
      name: dto.name,
      resources: dto.permissions.map((permission) => permission.resource)
    }

    const res = await axiosWithBearer.post(`${this.baseUrl}/roles`, apiPayload)
    return res.data.item
  }

  async edit(roleUuid: UUID, dto: EditRoleDTO): Promise<Role> {
    const apiPayload = {
      name: dto.name,
      resources: dto.permissions?.map((permission) => permission.resource)
    }

    const res = await axiosWithBearer.put(
      `${this.baseUrl}/roles/${roleUuid}`,
      apiPayload
    )
    return res.data.item
  }
}
