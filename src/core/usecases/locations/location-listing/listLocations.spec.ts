import { Location } from '@core/entities/location'
import { listLocations } from '@core/usecases/locations/location-listing/listLocations'
import { createPinia, setActivePinia } from 'pinia'
import { useLocationStore } from '@store/locationStore'
import { InMemoryLocationGateway } from '@adapters/secondary/location-gateways/inMemoryLocationGateway'
import { reserve, zoneGeo } from '@utils/testData/locations'

describe('Location listing', () => {
  let locationStore: any
  let locationGateway: InMemoryLocationGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    locationStore = useLocationStore()
    locationGateway = new InMemoryLocationGateway()
  })

  describe('There is no location', () => {
    it('should list nothing', async () => {
      await whenListLocations()
      expectStoreToEqual()
    })
  })

  describe('There is some locations', () => {
    it('should list all of them', async () => {
      givenExistingLocations(zoneGeo, reserve)
      await whenListLocations()
      expectStoreToEqual(zoneGeo, reserve)
    })
  })

  const givenExistingLocations = (...locations: Array<Location>) => {
    locationGateway.feedWith(...locations)
  }

  const whenListLocations = async () => {
    await listLocations(locationGateway)
  }

  const expectStoreToEqual = (...locations: Array<Location>) => {
    expect(locationStore.items).toStrictEqual(locations)
  }
})
