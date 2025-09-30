import {
  RoleFormVM,
  RoleFormFieldsReader,
  RoleFormFieldsWriter,
  FormInitializer,
  type Field,
  type RolePermissionOption
} from '@adapters/primary/view-models/roles/role-form/roleFormVM'
import { useFormStore } from '@store/formStore'
import { CreateRoleDTO } from '@core/gateways/roleGateway'
import { Permission } from '@core/entities/permission'
import { PermissionResource } from '@core/entities/permissionResource'

export class NewRoleFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init(): void {
    this.formStore.set(this.key, {
      name: '',
      permissions: []
    })
  }
}

export class RoleFormCreateVM extends RoleFormVM {
  private fieldsReader: RoleFormFieldsReader
  private fieldsWriter: RoleFormFieldsWriter

  constructor(
    initializer: NewRoleFormInitializer,
    fieldsReader: RoleFormFieldsReader,
    fieldsWriter: RoleFormFieldsWriter
  ) {
    super()
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

  getDto(): CreateRoleDTO {
    return {
      name: this.fieldsReader.get('name'),
      permissions: this.fieldsReader.get('permissions') as Array<Permission>
    }
  }
}

export const roleFormCreateVM = (key: string): RoleFormCreateVM => {
  const initializer = new NewRoleFormInitializer(key)
  const reader = new RoleFormFieldsReader(key)
  const writer = new RoleFormFieldsWriter(key, reader)
  return new RoleFormCreateVM(initializer, reader, writer)
}
