import { PermissionResource } from '@core/entities/permissionResource'

export const getPermissionTranslationKey = (
  permission: PermissionResource
): string => {
  return `permissions.resources.${permission}`
}

export const getPermissionResourceKey = (
  permissionResource: string
): string => {
  return `permissions.resources.${permissionResource}`
}
