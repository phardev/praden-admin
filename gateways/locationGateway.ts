import * as locations from '@utils/testData/locations'
import { LocationGateway } from '@core/gateways/locationGateway'
import { InMemoryLocationGateway } from '@adapters/secondary/location-gateways/inMemoryLocationGateway'
import { isLocalEnv } from '@utils/env'
import { RealLocationGateway } from '@adapters/secondary/location-gateways/realLocationGateway'

const locationGateway = new InMemoryLocationGateway()
locationGateway.feedWith(...Object.values(locations))

export const useLocationGateway = (): LocationGateway => {
  if (isLocalEnv()) {
    return locationGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLocationGateway(BACKEND_URL)
}
