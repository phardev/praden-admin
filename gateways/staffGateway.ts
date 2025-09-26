import * as staff from '@utils/testData/staff'
import * as roles from '@utils/testData/roles'
import { RealStaffGateway } from '@adapters/secondary/staff-gateways/RealStaffGateway'
import { isLocalEnv } from '@utils/env'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryStaffGateway } from '@adapters/secondary/staff-gateways/InMemoryStaffGateway'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-uuid')
const staffGateway = new InMemoryStaffGateway(uuidGenerator)
staffGateway.feedWith(...Object.values(staff))
staffGateway.feedWithRoles(...Object.values(roles))

export const useStaffGateway = () => {
  if (isLocalEnv()) {
    return staffGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealStaffGateway(BACKEND_URL)
}
