import { useRoleStore } from '@store/roleStore'
import { useSystemResourceStore } from '@store/systemResourceStore'
import { Role } from '@core/entities/role'

export interface PermissionMatrixVM {
  systemResources: Array<string>
  roles: Array<{ uuid: string; name: string }>
  permissions: Record<string, Record<string, boolean>>
  isLoading: boolean
}

export const getPermissionMatrixVM = (): PermissionMatrixVM => {
  const roleStore = useRoleStore()
  const systemResourceStore = useSystemResourceStore()

  const systemResources = systemResourceStore.items
  const roles = roleStore.items

  const permissions: Record<string, Record<string, boolean>> = {}

  roles.forEach((role: Role) => {
    permissions[role.uuid] = {}

    systemResources.forEach((resource: string) => {
      const hasPermission = role.permissions.some(
        (permission) => permission.resource === resource
      )
      permissions[role.uuid][resource] = hasPermission
    })
  })

  return {
    systemResources,
    roles: roles.map((role: Role) => ({
      uuid: role.uuid,
      name: role.name
    })),
    permissions,
    isLoading: roleStore.isLoading || systemResourceStore.isLoading
  }
}
