import { getPermissionsVM } from '@adapters/primary/view-models/permissions/getPermissionsVM'
import { PermissionResource } from '@core/entities/permissionResource'
import {
  canAccessRoute,
  getPermissionKey,
  getRequiredPermission
} from '@utils/permissions/routePermissionMapping'

export const usePermissions = () => {
  const permissions = computed(() => getPermissionsVM())

  const canAccess = (route: string): boolean => {
    return canAccessRoute(
      route,
      permissions.value as unknown as Record<string, boolean>
    )
  }

  const hasPermission = (permission: PermissionResource): boolean => {
    const permissionKey = getPermissionKey(permission)
    return (
      (permissions.value as unknown as Record<string, boolean>)[
        permissionKey
      ] || false
    )
  }

  const getRoutePermission = (route: string): PermissionResource | null => {
    return getRequiredPermission(route)
  }

  const canAccessCurrentRoute = (): boolean => {
    const route = useRoute()
    return canAccess(route.path)
  }

  const requirePermission = (route: string, redirectTo = '/') => {
    if (!canAccess(route)) {
      navigateTo(redirectTo)
    }
  }

  const getAllPermissions = () => {
    return permissions.value
  }

  return {
    permissions: readonly(permissions),
    canAccess,
    hasPermission,
    getRoutePermission,
    canAccessCurrentRoute,
    requirePermission,
    getAllPermissions
  }
}
