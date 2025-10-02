import {
  RoleGateway,
  EditRoleDTO,
  CreateRoleDTO
} from '@core/gateways/roleGateway'
import { Role, sortByOrder } from '@core/entities/role'
import { UUID } from '@core/types/types'
import { UuidGenerator } from '@core/gateways/uuidGenerator'

export class InMemoryRoleGateway implements RoleGateway {
  private roles: Array<Role> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  async list(): Promise<Array<Role>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.roles)))
  }

  async reorder(roleUuids: Array<UUID>): Promise<Array<Role>> {
    for (const uuid of roleUuids) {
      const i = roleUuids.indexOf(uuid)
      await this.edit(uuid, { order: i })
    }
    this.roles = this.roles.sort(sortByOrder)
    return Promise.resolve(JSON.parse(JSON.stringify(this.roles)))
  }

  async create(dto: CreateRoleDTO): Promise<Role> {
    const newRole: Role = {
      uuid: this.uuidGenerator.generate(),
      name: dto.name,
      permissions: dto.permissions,
      order: this.roles.length
    }

    this.roles.push(newRole)
    return Promise.resolve(JSON.parse(JSON.stringify(newRole)))
  }

  async edit(roleUuid: UUID, dto: EditRoleDTO): Promise<Role> {
    const roleIndex = this.roles.findIndex((r) => r.uuid === roleUuid)
    if (roleIndex === -1) {
      throw new Error(`Role with UUID ${roleUuid} not found`)
    }

    const updatedRole = {
      ...this.roles[roleIndex],
      ...dto
    }

    this.roles[roleIndex] = updatedRole
    return Promise.resolve(JSON.parse(JSON.stringify(updatedRole)))
  }

  feedWith(...roles: Array<Role>) {
    this.roles = roles
  }
}
