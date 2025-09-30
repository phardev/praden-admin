import { Role } from '@core/entities/role'
import { Permission } from '@core/entities/permission'
import { UUID } from '@core/types/types'

export interface CreateRoleDTO {
  name: string
  permissions: Array<Permission>
}

export interface EditRoleDTO {
  name: string
  permissions: Array<Permission>
}

export interface RoleGateway {
  list(): Promise<Array<Role>>
  create(dto: CreateRoleDTO): Promise<Role>
  edit(roleUuid: UUID, dto: EditRoleDTO): Promise<Role>
}
