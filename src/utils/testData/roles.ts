import { Role } from '@core/entities/role'
import { PermissionResource } from '@core/entities/permissionResource'

export const adminRole: Role = {
  uuid: 'role-admin',
  name: 'Administrateur',
  order: 0,
  permissions: [
    { resource: PermissionResource.DASHBOARD },
    { resource: PermissionResource.REMINDERS },
    { resource: PermissionResource.PRODUCTS },
    { resource: PermissionResource.LABORATORIES },
    { resource: PermissionResource.CATEGORIES },
    { resource: PermissionResource.PROMOTIONS },
    { resource: PermissionResource.PROMOTION_CODES },
    { resource: PermissionResource.CUSTOMERS },
    { resource: PermissionResource.NEWSLETTER },
    { resource: PermissionResource.SUPPORT },
    { resource: PermissionResource.DELIVERIES },
    { resource: PermissionResource.PREPARATIONS },
    { resource: PermissionResource.ORDERS },
    { resource: PermissionResource.BANNERS },
    { resource: PermissionResource.STAFF },
    { resource: PermissionResource.RESEARCH }
  ]
}

export const pharmacistRole: Role = {
  uuid: 'role-pharmacist',
  name: 'Pharmacien',
  order: 1,
  permissions: [
    { resource: PermissionResource.DASHBOARD },
    { resource: PermissionResource.REMINDERS },
    { resource: PermissionResource.PRODUCTS },
    { resource: PermissionResource.LABORATORIES },
    { resource: PermissionResource.CATEGORIES },
    { resource: PermissionResource.PROMOTIONS },
    { resource: PermissionResource.PROMOTION_CODES },
    { resource: PermissionResource.CUSTOMERS },
    { resource: PermissionResource.NEWSLETTER },
    { resource: PermissionResource.SUPPORT },
    { resource: PermissionResource.DELIVERIES },
    { resource: PermissionResource.PREPARATIONS },
    { resource: PermissionResource.ORDERS },
    { resource: PermissionResource.BANNERS }
  ]
}

export const assistantRole: Role = {
  uuid: 'role-assistant',
  name: 'Assistant',
  order: 2,
  permissions: [
    { resource: PermissionResource.DASHBOARD },
    { resource: PermissionResource.REMINDERS },
    { resource: PermissionResource.CUSTOMERS },
    { resource: PermissionResource.NEWSLETTER },
    { resource: PermissionResource.SUPPORT },
    { resource: PermissionResource.PREPARATIONS },
    { resource: PermissionResource.ORDERS }
  ]
}
