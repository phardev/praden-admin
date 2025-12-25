import { EditRoleDTO, RoleGateway } from '@core/gateways/roleGateway'
import { UUID } from '@core/types/types'
import { useRoleStore } from '@store/roleStore'

export { type EditRoleDTO } from '@core/gateways/roleGateway'

export const editRole = async (
  roleUuid: UUID,
  dto: EditRoleDTO,
  roleGateway: RoleGateway
): Promise<void> => {
  const roleStore = useRoleStore()
  try {
    roleStore.startLoading()
    const edited = await roleGateway.edit(roleUuid, dto)
    roleStore.edit(edited)
  } finally {
    roleStore.stopLoading()
  }
}
