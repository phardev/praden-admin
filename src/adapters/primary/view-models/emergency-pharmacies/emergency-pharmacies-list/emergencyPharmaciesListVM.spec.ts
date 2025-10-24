import { emergencyPharmaciesListVM } from '@adapters/primary/view-models/emergency-pharmacies/emergency-pharmacies-list/emergencyPharmaciesListVM'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'
import {
  emergencyPharmacy1,
  emergencyPharmacy2
} from '@utils/testData/emergencyPharmacies'
import { createPinia, setActivePinia } from 'pinia'

describe('Emergency Pharmacies List VM', () => {
  let emergencyPharmacyStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    emergencyPharmacyStore = useEmergencyPharmacyStore()
  })

  describe('Given empty store', () => {
    it('should return empty pharmacies grouped by date', () => {
      const vm = emergencyPharmaciesListVM()
      expect(vm.pharmaciesGroupedByDate).toStrictEqual([])
    })

    it('should reflect loading state from store', () => {
      emergencyPharmacyStore.startLoading()
      const vm = emergencyPharmaciesListVM()
      expect(vm.isLoading).toStrictEqual(true)
    })
  })

  describe('Given pharmacies with different dates', () => {
    it('should group pharmacies by date', () => {
      emergencyPharmacyStore.list([emergencyPharmacy1, emergencyPharmacy2])
      const vm = emergencyPharmaciesListVM()
      expect(vm.pharmaciesGroupedByDate).toStrictEqual([
        {
          date: 1735171200000,
          pharmacies: [emergencyPharmacy2]
        },
        {
          date: 1735084800000,
          pharmacies: [emergencyPharmacy1]
        }
      ])
    })

    it('should handle multiple pharmacies with same date', () => {
      const pharmacy1SameDate = {
        ...emergencyPharmacy1,
        uuid: 'pharm-same-date'
      }
      emergencyPharmacyStore.list([emergencyPharmacy1, pharmacy1SameDate])
      const vm = emergencyPharmaciesListVM()
      expect(vm.pharmaciesGroupedByDate).toStrictEqual([
        {
          date: 1735084800000,
          pharmacies: [emergencyPharmacy1, pharmacy1SameDate]
        }
      ])
    })
  })

  describe('Date formatting', () => {
    it('should format date with French locale and weekday', () => {
      const vm = emergencyPharmaciesListVM()
      expect(vm.formatDate(1735084800000)).toStrictEqual(
        'mercredi 25 décembre 2024'
      )
    })
  })

  describe('Delete modal state', () => {
    it('should reflect deleting state from store', () => {
      emergencyPharmacyStore.startLoading()
      const vm = emergencyPharmaciesListVM()
      expect(vm.isDeleting).toStrictEqual(true)
    })

    it('should start with delete modal closed', () => {
      const vm = emergencyPharmaciesListVM()
      expect(vm.isDeleteModalOpen).toStrictEqual(false)
    })

    it('should start with null pharmacy to delete', () => {
      const vm = emergencyPharmaciesListVM()
      expect(vm.pharmacyToDelete).toStrictEqual(null)
    })

    it('should open delete modal with pharmacy', () => {
      const vm = emergencyPharmaciesListVM()
      vm.openDeleteModal(emergencyPharmacy1)
      expect(vm.isDeleteModalOpen).toStrictEqual(true)
    })

    it('should store pharmacy when opening modal', () => {
      const vm = emergencyPharmaciesListVM()
      vm.openDeleteModal(emergencyPharmacy1)
      expect(vm.pharmacyToDelete).toStrictEqual(emergencyPharmacy1)
    })

    it('should close delete modal', () => {
      const vm = emergencyPharmaciesListVM()
      vm.openDeleteModal(emergencyPharmacy1)
      vm.closeDeleteModal()
      expect(vm.isDeleteModalOpen).toStrictEqual(false)
    })

    it('should clear pharmacy when closing modal', () => {
      const vm = emergencyPharmaciesListVM()
      vm.openDeleteModal(emergencyPharmacy1)
      vm.closeDeleteModal()
      expect(vm.pharmacyToDelete).toStrictEqual(null)
    })
  })
})
