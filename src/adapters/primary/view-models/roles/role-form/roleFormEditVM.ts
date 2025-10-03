import {
  RoleFormVM,
  RoleFormFieldsReader,
  RoleFormFieldsWriter,
  FormInitializer,
  type Field,
  type RolePermissionOption
} from '@adapters/primary/view-models/roles/role-form/roleFormVM'
import { useFormStore } from '@store/formStore'
import { useRoleStore } from '@store/roleStore'
import { EditRoleDTO } from '@core/gateways/roleGateway'
import { Permission } from '@core/entities/permission'
import { PermissionResource } from '@core/entities/permissionResource'
import { UUID } from '@core/types/types'

export class ExistingRoleFormInitializer implements FormInitializer {
  protected readonly key: string
  protected readonly roleUuid: UUID
  protected formStore: any

  constructor(key: string, roleUuid: UUID) {
    this.key = key
    this.roleUuid = roleUuid
    this.formStore = useFormStore()
  }

  init(): void {
    const roleStore = useRoleStore()
    const existingRole = roleStore.getByUuid(this.roleUuid)

    if (!existingRole) {
      throw new Error(`Role with UUID ${this.roleUuid} not found`)
    }

    this.formStore.set(this.key, {
      name: existingRole.name,
      permissions: JSON.parse(JSON.stringify(existingRole.permissions))
    })
  }
}

export class RoleFormEditVM extends RoleFormVM {
  private readonly roleUuid: UUID
  private fieldsReader: RoleFormFieldsReader
  private fieldsWriter: RoleFormFieldsWriter

  constructor(
    roleUuid: UUID,
    initializer: ExistingRoleFormInitializer,
    fieldsReader: RoleFormFieldsReader,
    fieldsWriter: RoleFormFieldsWriter
  ) {
    super()
    this.roleUuid = roleUuid
    initializer.init()
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  async set(fieldName: string, value: any): Promise<void> {
    this.fieldsWriter.set(fieldName, value)
  }

  togglePermission(resource: PermissionResource): void {
    this.fieldsWriter.togglePermission(resource)
  }

  getAvailablePermissions(): Array<RolePermissionOption> {
    return this.fieldsReader.getAvailablePermissions()
  }

  getCanValidate(): boolean {
    const name = this.fieldsReader.get('name')
    const permissions = this.fieldsReader.get(
      'permissions'
    ) as Array<Permission>

    return !!(
      name &&
      name.trim().length > 0 &&
      permissions &&
      permissions.length > 0
    )
  }

  getRoleUuid(): UUID {
    return this.roleUuid
  }

  getDto(): EditRoleDTO {
    return {
      name: this.fieldsReader.get('name'),
      permissions: this.fieldsReader.get('permissions') as Array<Permission>
    }
  }
}

export const roleFormEditVM = (key: string, roleUuid: UUID): RoleFormEditVM => {
  const initializer = new ExistingRoleFormInitializer(key, roleUuid)
  const reader = new RoleFormFieldsReader(key)
  const writer = new RoleFormFieldsWriter(key, reader)
  return new RoleFormEditVM(roleUuid, initializer, reader, writer)
}
