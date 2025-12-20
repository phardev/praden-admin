import { createRole } from '@core/usecases/roles/role-creation/createRole'
import { editRole } from '@core/usecases/roles/role-edition/editRole'
import { useRoleGateway } from '../../../../../gateways/roleGateway'

export const useRoleForm = () => {
  const roleGateway = useRoleGateway()

  const createNewRole = async (vm: any) => {
    try {
      const dto = vm.getDto()
      await createRole(dto, roleGateway)
      return { success: true }
    } catch (error: any) {
      return { success: false, error }
    }
  }

  const updateRole = async (roleUuid: string, vm: any) => {
    try {
      const dto = vm.getDto()
      await editRole(roleUuid, dto, roleGateway)
      return { success: true }
    } catch (error: any) {
      return { success: false, error }
    }
  }

  return {
    createNewRole,
    updateRole
  }
}
