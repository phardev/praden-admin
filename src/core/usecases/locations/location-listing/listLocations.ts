import { LocationGateway } from '@core/gateways/locationGateway'
import { useLocationStore } from '@store/locationStore'

export const listLocations = async (locationGateway: LocationGateway) => {
  const locationStore = useLocationStore()

  if (locationStore.isLoading) {
    return
  }

  try {
    locationStore.startLoading()
    const locations = await locationGateway.list()
    locationStore.list(locations)
  } finally {
    locationStore.stopLoading()
  }
}
