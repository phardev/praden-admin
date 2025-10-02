import { RoleGateway } from '@core/gateways/roleGateway'
import { useRoleStore } from '@store/roleStore'
import { UUID } from '@core/types/types'

export const reorderRoles = async (
  roles: Array<UUID>,
  roleGateway: RoleGateway
) => {
  const reordered = await roleGateway.reorder(roles)
  const roleStore = useRoleStore()
  roleStore.list(reordered)
}
