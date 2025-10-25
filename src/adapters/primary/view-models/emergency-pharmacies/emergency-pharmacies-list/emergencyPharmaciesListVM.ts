import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'
import { useEmergencyPharmacyStore } from '@store/emergencyPharmacyStore'

export interface PharmacyGroup {
  date: number
  pharmacies: Array<EmergencyPharmacy>
}

export interface EmergencyPharmaciesListVM {
  pharmaciesGroupedByDate: Array<PharmacyGroup>
  isLoading: boolean
  isDeleting: boolean
  formatDate: (timestamp: number) => string
  isDeleteModalOpen: boolean
  pharmacyToDelete: EmergencyPharmacy | null
  openDeleteModal: (pharmacy: EmergencyPharmacy) => void
  closeDeleteModal: () => void
}

const groupPharmaciesByDate = (
  pharmacies: Array<EmergencyPharmacy>
): Array<PharmacyGroup> => {
  const grouped = new Map<number, Array<EmergencyPharmacy>>()
  pharmacies.forEach((pharmacy) => {
    if (!grouped.has(pharmacy.date)) {
      grouped.set(pharmacy.date, [])
    }
    grouped.get(pharmacy.date)!.push(pharmacy)
  })
  return Array.from(grouped.entries())
    .map(([date, pharmacies]) => ({ date, pharmacies }))
    .sort((a, b) => b.date - a.date)
}

const formatDate = (timestamp: number): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(timestamp))
}

export const emergencyPharmaciesListVM = (): EmergencyPharmaciesListVM => {
  const emergencyPharmacyStore = useEmergencyPharmacyStore()
  let isDeleteModalOpen = false
  let pharmacyToDelete: EmergencyPharmacy | null = null
  return {
    get pharmaciesGroupedByDate() {
      return groupPharmaciesByDate(emergencyPharmacyStore.items)
    },
    get isLoading() {
      return emergencyPharmacyStore.isLoading
    },
    get isDeleting() {
      return emergencyPharmacyStore.isLoading
    },
    formatDate,
    get isDeleteModalOpen() {
      return isDeleteModalOpen
    },
    get pharmacyToDelete() {
      return pharmacyToDelete
    },
    openDeleteModal(pharmacy: EmergencyPharmacy) {
      isDeleteModalOpen = true
      pharmacyToDelete = pharmacy
    },
    closeDeleteModal() {
      isDeleteModalOpen = false
      pharmacyToDelete = null
    }
  }
}
