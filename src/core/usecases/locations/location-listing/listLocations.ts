import { LocationGateway } from '@core/gateways/locationGateway'
import { useLocationStore } from '@store/locationStore'

export const listLocations = async (locationGateway: LocationGateway) => {
  const locations = await locationGateway.list()
  const locationStore = useLocationStore()
  locationStore.list(locations)
}
