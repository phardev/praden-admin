import { RoleGateway } from '@core/gateways/roleGateway'
import { useRoleStore } from '@store/roleStore'

export const listRoles = async (roleGateway: RoleGateway) => {
  const roleStore = useRoleStore()
  try {
    roleStore.startLoading()
    const roles = await roleGateway.list()
    roleStore.list(roles)
  } finally {
    roleStore.stopLoading()
  }
}
