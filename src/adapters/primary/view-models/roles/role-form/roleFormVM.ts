import { useRoleStore } from '@store/roleStore'
import { useFormStore } from '@store/formStore'
import { PermissionResource } from '@core/entities/permissionResource'
import { Permission } from '@core/entities/permission'

export interface RolePermissionOption {
  resource: PermissionResource
  label: string
  selected: boolean
}

export interface Field<T> {
  value: T
  canEdit: boolean
}

export interface FormInitializer {
  init(): void
}

export class FormFieldsReader {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  get(fieldName: string): any {
    return this.formStore.get(this.key)?.[fieldName]
  }
}

export class RoleFormFieldsReader extends FormFieldsReader {
  constructor(key: string) {
    super(key)
  }

  getAvailablePermissions(): Array<RolePermissionOption> {
    const selectedPermissions =
      (this.get('permissions') as Array<Permission>) || []
    const selectedResources = selectedPermissions.map((p) => p.resource)

    const permissionLabels: Record<PermissionResource, string> = {
      [PermissionResource.DASHBOARD]: 'Tableau de bord',
      [PermissionResource.REMINDERS]: 'Rappels',
      [PermissionResource.PRODUCTS]: 'Produits',
      [PermissionResource.LABORATORIES]: 'Laboratoires',
      [PermissionResource.CATEGORIES]: 'Catégories',
      [PermissionResource.PROMOTIONS]: 'Promotions',
      [PermissionResource.PROMOTION_CODES]: 'Codes de promotion',
      [PermissionResource.CUSTOMERS]: 'Clients',
      [PermissionResource.NEWSLETTER]: 'Newsletter',
      [PermissionResource.SUPPORT]: 'Support',
      [PermissionResource.DELIVERIES]: 'Livraisons',
      [PermissionResource.PREPARATIONS]: 'Préparations',
      [PermissionResource.ORDERS]: 'Commandes',
      [PermissionResource.BANNERS]: 'Bannières',
      [PermissionResource.STAFF]: 'Équipe',
      [PermissionResource.RESEARCH]: 'Recherche'
    }

    return Object.values(PermissionResource).map((resource) => ({
      resource,
      label: permissionLabels[resource],
      selected: selectedResources.includes(resource)
    }))
  }
}

export class FormFieldsWriter {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  set(fieldName: string, value: any): void {
    this.formStore.set(this.key, { [fieldName]: value })
  }
}

export class RoleFormFieldsWriter extends FormFieldsWriter {
  protected fieldsReader: RoleFormFieldsReader

  constructor(key: string, fieldsReader: RoleFormFieldsReader) {
    super(key)
    this.fieldsReader = fieldsReader
  }

  togglePermission(resource: PermissionResource): void {
    const currentPermissions =
      (this.fieldsReader.get('permissions') as Array<Permission>) || []
    const hasPermission = currentPermissions.some(
      (p) => p.resource === resource
    )

    let newPermissions: Array<Permission>
    if (hasPermission) {
      newPermissions = currentPermissions.filter((p) => p.resource !== resource)
    } else {
      newPermissions = [...currentPermissions, { resource }]
    }

    this.set('permissions', newPermissions)
  }
}

export class RoleFormVM {
  isLoading(): boolean {
    const roleStore = useRoleStore()
    return roleStore.isLoading
  }
}
