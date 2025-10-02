import { useRoleStore } from '@store/roleStore'
import { Role } from '@core/entities/role'
import { UUID } from '@core/types/types'

export interface GetRoleListItemVM {
  uuid: UUID
  name: string
  permissionCount: number
}

export interface GetRoleListVM {
  items: Array<GetRoleListItemVM>
  isLoading: boolean
}

export const getRoleListVM = (): GetRoleListVM => {
  const roleStore = useRoleStore()
  const roles = roleStore.items

  return {
    items: roles.map((r: Role) => {
      return {
        uuid: r.uuid,
        name: r.name,
        permissionCount: r.permissions.length
      }
    }),
    isLoading: roleStore.isLoading
  }
}
