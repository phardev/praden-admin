import * as laboratories from '@utils/testData/laboratories'
import { isLocalEnv } from '@utils/env'
import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryLaboratoryGateway } from '@core/usecases/laboratories/laboratory-listing/inMemoryLaboratoryGateway'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-uuid')
const laboratoryGateway = new InMemoryLaboratoryGateway(uuidGenerator)
laboratoryGateway.feedWith(...Object.values(laboratories))

export const useLaboratoryGateway = () => {
  if (isLocalEnv()) {
    return laboratoryGateway
  }
  return laboratoryGateway
  // const { BACKEND_URL } = useRuntimeConfig().public
  // return new RealLaboratoryGateway(BACKEND_URL)
}
