import { RoleGateway } from '@core/gateways/roleGateway'
import { UUID } from '@core/types/types'
import { useRoleStore } from '@store/roleStore'

export const reorderRoles = async (
  roles: Array<UUID>,
  roleGateway: RoleGateway
) => {
  const reordered = await roleGateway.reorder(roles)
  const roleStore = useRoleStore()
  roleStore.list(reordered)
}
