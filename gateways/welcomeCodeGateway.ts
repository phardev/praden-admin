import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryWelcomeCodeGateway } from '@adapters/secondary/welcome-code-gateways/InMemoryWelcomeCodeGateway'
import { RealWelcomeCodeGateway } from '@adapters/secondary/welcome-code-gateways/RealWelcomeCodeGateway'
import { isLocalEnv } from '@utils/env'
import * as welcomeCodes from '@utils/testData/welcomeCodes'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-welcome-code')
const welcomeCodeGateway = new InMemoryWelcomeCodeGateway(uuidGenerator)
welcomeCodeGateway.feedWith(...Object.values(welcomeCodes))

export const useWelcomeCodeGateway = () => {
  if (isLocalEnv()) {
    return welcomeCodeGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealWelcomeCodeGateway(BACKEND_URL)
}
