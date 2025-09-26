import { Role } from '@core/entities/role'

export const adminRole: Role = {
  uuid: 'role-admin',
  name: 'Administrateur',
  permissions: [
    { resource: 'dashboard' },
    { resource: 'newsletter' },
    { resource: 'administration' },
    { resource: 'user-management' },
    { resource: 'reports' },
    { resource: 'analytics' },
    { resource: 'settings' }
  ]
}

export const pharmacistRole: Role = {
  uuid: 'role-pharmacist',
  name: 'Pharmacien',
  permissions: [
    { resource: 'dashboard' },
    { resource: 'newsletter' },
    { resource: 'user-management' },
    { resource: 'reports' },
    { resource: 'analytics' }
  ]
}

export const assistantRole: Role = {
  uuid: 'role-assistant',
  name: 'Assistant',
  permissions: [{ resource: 'dashboard' }, { resource: 'newsletter' }]
}
