import * as locations from '@utils/testData/locations'
import { LocationGateway } from '@core/gateways/locationGateway'
import { InMemoryLocationGateway } from '@adapters/secondary/location-gateways/inMemoryLocationGateway'

const locationGateway = new InMemoryLocationGateway()
locationGateway.feedWith(...Object.values(locations))

export const useLocationGateway = (): LocationGateway => {
  return locationGateway
}
