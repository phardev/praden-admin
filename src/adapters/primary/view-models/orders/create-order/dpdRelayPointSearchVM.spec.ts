import { useDpdRelayPointStore } from '@store/dpdRelayPointStore'
import {
  dpdRelayPointAlesCentre,
  dpdRelayPointAlesNord
} from '@utils/testData/dpdRelayPoints'
import { createPinia, setActivePinia } from 'pinia'
import type { DpdRelayPointSearchVM } from './dpdRelayPointSearchVM'
import { dpdRelayPointSearchVM } from './dpdRelayPointSearchVM'

describe('DPD relay point search VM', () => {
  let dpdRelayPointStore: ReturnType<typeof useDpdRelayPointStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    dpdRelayPointStore = useDpdRelayPointStore()
  })

  describe('There is no relay point', () => {
    it('should expose no point', () => {
      const expectedVM: DpdRelayPointSearchVM = {
        isLoading: false,
        points: []
      }
      expect(dpdRelayPointSearchVM()).toStrictEqual(expectedVM)
    })
  })

  describe('There are relay points', () => {
    it('should format the points for display', () => {
      dpdRelayPointStore.list([dpdRelayPointAlesCentre, dpdRelayPointAlesNord])
      const expectedVM: DpdRelayPointSearchVM = {
        isLoading: false,
        points: [
          {
            id: dpdRelayPointAlesCentre.id,
            name: dpdRelayPointAlesCentre.name,
            address: dpdRelayPointAlesCentre.address,
            cityLine: '30100 Alès',
            formattedDistance: '250 m',
            openingHours: dpdRelayPointAlesCentre.openingHours!
          },
          {
            id: dpdRelayPointAlesNord.id,
            name: dpdRelayPointAlesNord.name,
            address: dpdRelayPointAlesNord.address,
            cityLine: '30100 Alès',
            formattedDistance: '640 m',
            openingHours: []
          }
        ]
      }
      expect(dpdRelayPointSearchVM()).toStrictEqual(expectedVM)
    })
  })

  describe('The search is loading', () => {
    it('should expose the loading state', () => {
      dpdRelayPointStore.startLoading()
      expect(dpdRelayPointSearchVM().isLoading).toBe(true)
    })
  })
})
