import { Permission } from '@core/entities/permission'
import { UUID } from '@core/types/types'

export interface PermissionMatrixRole {
  uuid: UUID
  name: string
}

export interface EditRoleChangeDto {
  roleUuid: UUID
  roleName: string
  permissions: Array<Permission>
}

export class PermissionMatrixEditVM {
  private originalPermissions: Record<string, Record<string, boolean>>
  private currentPermissions: Record<string, Record<string, boolean>>
  private roles: Array<PermissionMatrixRole>

  constructor(
    initialPermissions: Record<string, Record<string, boolean>>,
    roles: Array<PermissionMatrixRole>
  ) {
    this.originalPermissions = JSON.parse(JSON.stringify(initialPermissions))
    this.currentPermissions = JSON.parse(JSON.stringify(initialPermissions))
    this.roles = JSON.parse(JSON.stringify(roles))
  }

  setPermission(
    roleUuid: string,
    resource: string,
    hasPermission: boolean
  ): void {
    if (!this.currentPermissions[roleUuid]) {
      this.currentPermissions[roleUuid] = {}
    }
    this.currentPermissions[roleUuid][resource] = hasPermission
  }

  getPermission(roleUuid: string, resource: string): boolean {
    return this.currentPermissions[roleUuid]?.[resource] || false
  }

  hasChanges(): boolean {
    return (
      JSON.stringify(this.originalPermissions) !==
      JSON.stringify(this.currentPermissions)
    )
  }

  getChangedRolesDto(): Array<EditRoleChangeDto> {
    const changes: Array<EditRoleChangeDto> = []

    for (const roleUuid in this.currentPermissions) {
      const originalRolePermissions = this.originalPermissions[roleUuid] || {}
      const currentRolePermissions = this.currentPermissions[roleUuid] || {}

      if (
        JSON.stringify(originalRolePermissions) !==
        JSON.stringify(currentRolePermissions)
      ) {
        const role = this.roles.find((r) => r.uuid === roleUuid)
        if (role) {
          const permissions = Object.entries(currentRolePermissions)
            .filter(([, hasPermission]) => hasPermission)
            .map(([resource]) => ({ resource }))

          changes.push({
            roleUuid,
            roleName: role.name,
            permissions
          })
        }
      }
    }

    return changes
  }

  getCurrentPermissions(): Record<string, Record<string, boolean>> {
    return JSON.parse(JSON.stringify(this.currentPermissions))
  }

  reset(): void {
    this.currentPermissions = JSON.parse(
      JSON.stringify(this.originalPermissions)
    )
  }

  updateOriginal(): void {
    this.originalPermissions = JSON.parse(
      JSON.stringify(this.currentPermissions)
    )
  }
}

export const permissionMatrixEditVM = (
  initialPermissions: Record<string, Record<string, boolean>>,
  roles: Array<PermissionMatrixRole>
): PermissionMatrixEditVM => {
  return new PermissionMatrixEditVM(initialPermissions, roles)
}
