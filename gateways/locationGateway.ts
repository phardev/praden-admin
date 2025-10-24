import { InMemoryLocationGateway } from '@adapters/secondary/location-gateways/inMemoryLocationGateway'
import { RealLocationGateway } from '@adapters/secondary/location-gateways/realLocationGateway'
import { LocationGateway } from '@core/gateways/locationGateway'
import { isLocalEnv } from '@utils/env'
import * as locations from '@utils/testData/locations'

const locationGateway = new InMemoryLocationGateway()
locationGateway.feedWith(...Object.values(locations))

export const useLocationGateway = (): LocationGateway => {
  if (isLocalEnv()) {
    return locationGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealLocationGateway(BACKEND_URL)
}
