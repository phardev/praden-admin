import { type RoleFormVM } from '@adapters/primary/view-models/roles/role-form/roleFormVM'
import { roleFormCreateVM } from '@adapters/primary/view-models/roles/role-form/roleFormCreateVM'
import { roleFormEditVM } from '@adapters/primary/view-models/roles/role-form/roleFormEditVM'
import { useRoleStore } from '@store/roleStore'
import { UUID } from '@core/types/types'

export interface GetRoleModalVM {
  isOpen: boolean
  isLoading: boolean
  isSubmitting: boolean
  currentFormVM: RoleFormVM | null
  error: string | null
}

export const getRoleModalVM = (): GetRoleModalVM => {
  const roleStore = useRoleStore()

  return {
    isOpen: false,
    isLoading: roleStore.isLoading,
    isSubmitting: false,
    currentFormVM: null,
    error: null
  }
}

export const openRoleModalForCreate = (): RoleFormVM => {
  return roleFormCreateVM('role-create-modal')
}

export const openRoleModalForEdit = (roleUuid: UUID): RoleFormVM => {
  const roleStore = useRoleStore()
  const role = roleStore.getByUuid(roleUuid)

  if (!role) {
    throw new Error(`Role with UUID ${roleUuid} not found`)
  }

  return roleFormEditVM(`role-edit-form-${roleUuid}`, roleUuid)
}
