import { RoleGateway, EditRoleDTO } from '@core/gateways/roleGateway'
import { Role } from '@core/entities/role'
import { UUID } from '@core/types/types'

export class InMemoryRoleGateway implements RoleGateway {
  private roles: Array<Role> = []

  async list(): Promise<Array<Role>> {
    return this.roles
  }

  async edit(roleUuid: UUID, dto: EditRoleDTO): Promise<Role> {
    const roleIndex = this.roles.findIndex((r) => r.uuid === roleUuid)
    if (roleIndex === -1) {
      throw new Error(`Role with UUID ${roleUuid} not found`)
    }

    const updatedRole = {
      ...this.roles[roleIndex],
      name: dto.name,
      permissions: dto.permissions
    }

    this.roles[roleIndex] = updatedRole
    return JSON.parse(JSON.stringify(updatedRole))
  }

  feedWith(...roles: Array<Role>) {
    this.roles = roles
  }
}
