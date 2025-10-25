import { Role } from '@core/entities/role'
import { UUID } from '@core/types/types'
import { useRoleStore } from '@store/roleStore'

export interface GetRoleItemVM {
  uuid: UUID
  name: string
}

export interface GetRolesVM {
  items: Array<GetRoleItemVM>
  isLoading: boolean
}

export const getRolesVM = (): GetRolesVM => {
  const roleStore = useRoleStore()
  const roles = roleStore.items

  return {
    items: roles.map((r: Role) => {
      return {
        uuid: r.uuid,
        name: r.name
      }
    }),
    isLoading: roleStore.isLoading
  }
}
