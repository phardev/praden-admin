import { Permission } from '@core/entities/permission'
import { Role } from '@core/entities/role'
import { UUID } from '@core/types/types'
import { useRoleStore } from '@store/roleStore'
import { useSystemResourceStore } from '@store/systemResourceStore'

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
  private roleStore: any
  private systemResourceStore: any

  constructor() {
    this.roleStore = useRoleStore()
    this.systemResourceStore = useSystemResourceStore()

    const permissions = this.buildPermissionsFromStore()
    this.originalPermissions = JSON.parse(JSON.stringify(permissions))
    this.currentPermissions = JSON.parse(JSON.stringify(permissions))
  }

  private buildPermissionsFromStore(): Record<string, Record<string, boolean>> {
    const permissions: Record<string, Record<string, boolean>> = {}
    const roles = this.roleStore.items
    const systemResources = this.systemResourceStore.items

    roles.forEach((role: Role) => {
      permissions[role.uuid] = {}
      systemResources.forEach((resource: string) => {
        const hasPermission = role.permissions.some(
          (permission) => permission.resource === resource
        )
        permissions[role.uuid][resource] = hasPermission
      })
    })

    return permissions
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

  get systemResources(): Array<string> {
    return this.systemResourceStore.items
  }

  get roles(): Array<PermissionMatrixRole> {
    return this.roleStore.items.map((role: Role) => ({
      uuid: role.uuid,
      name: role.name
    }))
  }

  get permissions(): Record<string, Record<string, boolean>> {
    return this.currentPermissions
  }

  get isLoading(): boolean {
    return this.roleStore.isLoading || this.systemResourceStore.isLoading
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
        const role = this.roleStore.items.find((r: Role) => r.uuid === roleUuid)
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

  refreshFromStore(): void {
    const permissions = this.buildPermissionsFromStore()
    this.originalPermissions = JSON.parse(JSON.stringify(permissions))
    this.currentPermissions = JSON.parse(JSON.stringify(permissions))
  }
}

export const permissionMatrixEditVM = (): PermissionMatrixEditVM => {
  return new PermissionMatrixEditVM()
}
