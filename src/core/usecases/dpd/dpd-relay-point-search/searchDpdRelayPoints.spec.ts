import { InMemoryDpdPickupGateway } from '@adapters/secondary/dpd-pickup-gateways/InMemoryDpdPickupGateway'
import type { RelayPointSearchParams } from '@core/entities/relayPoint'
import { useDpdRelayPointStore } from '@store/dpdRelayPointStore'
import {
  dpdRelayPointAlesCentre,
  dpdRelayPointAlesNord
} from '@utils/testData/dpdRelayPoints'
import { createPinia, setActivePinia } from 'pinia'
import { searchDpdRelayPoints } from './searchDpdRelayPoints'

describe('DPD relay point search', () => {
  let dpdRelayPointStore: any
  let dpdPickupGateway: InMemoryDpdPickupGateway
  const params: RelayPointSearchParams = { zipCode: '30100', city: 'Alès' }

  beforeEach(() => {
    setActivePinia(createPinia())
    dpdRelayPointStore = useDpdRelayPointStore()
    dpdPickupGateway = new InMemoryDpdPickupGateway()
  })

  describe('There is no relay point around the address', () => {
    it('should store nothing', async () => {
      await whenSearchDpdRelayPoints()
      expect(dpdRelayPointStore.items).toStrictEqual([])
    })
  })

  describe('There are relay points around the address', () => {
    it('should store them', async () => {
      dpdPickupGateway.feedWith(dpdRelayPointAlesCentre, dpdRelayPointAlesNord)
      await whenSearchDpdRelayPoints()
      expect(dpdRelayPointStore.items).toStrictEqual([
        dpdRelayPointAlesCentre,
        dpdRelayPointAlesNord
      ])
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = dpdRelayPointStore.$subscribe(
        (mutation: any, state: any) => {
          expect(state.isLoading).toBe(true)
          unsubscribe()
        }
      )
      dpdPickupGateway.feedWith(dpdRelayPointAlesCentre)
      await whenSearchDpdRelayPoints()
    })
    it('should be aware that loading is over', async () => {
      dpdPickupGateway.feedWith(dpdRelayPointAlesCentre)
      await whenSearchDpdRelayPoints()
      expect(dpdRelayPointStore.isLoading).toBe(false)
    })
  })

  const whenSearchDpdRelayPoints = async () => {
    await searchDpdRelayPoints(params, dpdPickupGateway)
  }
})
