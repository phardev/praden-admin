import { InMemoryLocationGateway } from '@adapters/secondary/location-gateways/inMemoryLocationGateway'
import { Location } from '@core/entities/location'
import { listLocations } from '@core/usecases/locations/location-listing/listLocations'
import { useLocationStore } from '@store/locationStore'
import { reserve, zoneGeo } from '@utils/testData/locations'
import { createPinia, setActivePinia } from 'pinia'

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

  describe('Loading', () => {
    beforeEach(() => {
      locationGateway.feedWith(reserve)
    })
    it('should be aware during loading', async () => {
      const unsubscribe = locationStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      await whenListLocations()
    })
    it('should be aware that loading is over', async () => {
      await whenListLocations()
      expect(locationStore.isLoading).toBe(false)
    })
  })

  describe('Request deduplication', () => {
    beforeEach(() => {
      locationGateway.feedWith(reserve, zoneGeo)
    })
    it('should prevent duplicate concurrent requests', async () => {
      locationStore.startLoading()
      await whenListLocations()
      expect(locationStore.items).toStrictEqual([])
    })
    it('should allow request when not loading', async () => {
      await whenListLocations()
      expect(locationStore.items).toStrictEqual([reserve, zoneGeo])
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
