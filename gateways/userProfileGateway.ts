import * as userProfiles from '@utils/testData/userProfiles'
import { RealUserProfileGateway } from '@adapters/secondary/profile-gateways/RealUserProfileGateway'
import { InMemoryUserProfileGateway } from '@adapters/secondary/profile-gateways/InMemoryUserProfileGateway'
import { isLocalEnv } from '@utils/env'

const userProfileGateway = new InMemoryUserProfileGateway()
userProfileGateway.feedWith(...Object.values(userProfiles))

export const useUserProfileGateway = () => {
  if (isLocalEnv()) {
    return userProfileGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealUserProfileGateway(BACKEND_URL)
}
