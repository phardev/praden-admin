import {
  GetEmergencyPharmaciesVM,
  getEmergencyPharmaciesVM
} from '@adapters/primary/view-models/emergency-pharmacies/getEmergencyPharmaciesVM'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import {
  emergencyPharmacy1,
  emergencyPharmacy2,
  emergencyPharmacy3
} from '@utils/testData/emergencyPharmacies'
import { createPinia, setActivePinia } from 'pinia'

describe('Get emergency pharmacies VM', () => {
  let emergencyPharmacyStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    emergencyPharmacyStore = useEmergencyPharmacyStore()
  })

  describe('There are no pharmacies', () => {
    it('should return empty items and loading false', () => {
      const vm = getEmergencyPharmaciesVM()
      expect(vm).toStrictEqual({
        items: [],
        isLoading: false,
        error: null
      })
    })
  })

  describe('There are pharmacies', () => {
    it('should return all pharmacies as VM items', () => {
      emergencyPharmacyStore.list([
        emergencyPharmacy1,
        emergencyPharmacy2,
        emergencyPharmacy3
      ])
      const vm = getEmergencyPharmaciesVM()
      const expected: GetEmergencyPharmaciesVM = {
        items: [
          {
            uuid: emergencyPharmacy1.uuid,
            name: emergencyPharmacy1.name,
            address: emergencyPharmacy1.address,
            phone: emergencyPharmacy1.phone,
            date: emergencyPharmacy1.date,
            isActive: emergencyPharmacy1.isActive
          },
          {
            uuid: emergencyPharmacy2.uuid,
            name: emergencyPharmacy2.name,
            address: emergencyPharmacy2.address,
            phone: emergencyPharmacy2.phone,
            date: emergencyPharmacy2.date,
            isActive: emergencyPharmacy2.isActive
          },
          {
            uuid: emergencyPharmacy3.uuid,
            name: emergencyPharmacy3.name,
            address: emergencyPharmacy3.address,
            phone: emergencyPharmacy3.phone,
            date: emergencyPharmacy3.date,
            isActive: emergencyPharmacy3.isActive
          }
        ],
        isLoading: false,
        error: null
      }
      expect(vm).toStrictEqual(expected)
    })
  })
})
