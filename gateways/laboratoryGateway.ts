import { InMemoryTimeoutLaboratoryGateway } from '@adapters/secondary/laboratory-gateways/inMemoryTimeoutLaboratoryGateway'
import { RealLaboratoryGateway } from '@adapters/secondary/laboratory-gateways/realLaboratoryGateway'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { isLocalEnv } from '@utils/env'
import * as laboratories from '@utils/testData/laboratories'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-uuid')
const laboratoryGateway = new InMemoryTimeoutLaboratoryGateway(
  500,
  uuidGenerator
)
laboratoryGateway.feedWith(...Object.values(laboratories))

export const useLaboratoryGateway = () => {
  if (isLocalEnv()) {
    return laboratoryGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLaboratoryGateway(BACKEND_URL)
}
