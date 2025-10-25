import { CreateRoleDTO, RoleGateway } from '@core/gateways/roleGateway'
import { useRoleStore } from '@store/roleStore'

export const createRole = async (
  dto: CreateRoleDTO,
  roleGateway: RoleGateway
): Promise<void> => {
  const roleStore = useRoleStore()
  try {
    roleStore.startLoading()
    const created = await roleGateway.create(dto)
    roleStore.create(created)
  } finally {
    roleStore.stopLoading()
  }
}

export type { CreateRoleDTO }
