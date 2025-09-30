import * as roles from '@utils/testData/roles'
import { RealRoleGateway } from '@adapters/secondary/role-gateways/RealRoleGateway'
import { isLocalEnv } from '@utils/env'
import { InMemoryRoleGateway } from '@adapters/secondary/role-gateways/InMemoryRoleGateway'
import { useUuidGenerator } from './uuidGenerator'

const roleGateway = new InMemoryRoleGateway(useUuidGenerator())
roleGateway.feedWith(...Object.values(roles))

export const useRoleGateway = () => {
  if (isLocalEnv()) {
    return roleGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealRoleGateway(BACKEND_URL)
}
