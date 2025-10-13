import { EmergencyPharmacy } from '@core/entities/emergencyPharmacy'
import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const useEmergencyPharmacyStore = defineStore('EmergencyPharmacyStore', {
  state: () => {
    return {
      items: [] as Array<EmergencyPharmacy>,
      current: undefined as EmergencyPharmacy | undefined,
      isLoading: false,
      error: null as string | null
    }
  },
  actions: {
    list(pharmacies: Array<EmergencyPharmacy>) {
      this.items = JSON.parse(JSON.stringify(pharmacies))
      this.error = null
    },
    add(pharmacy: EmergencyPharmacy) {
      this.items.push(JSON.parse(JSON.stringify(pharmacy)))
    },
    update(pharmacy: EmergencyPharmacy) {
      const index = this.items.findIndex((p) => p.uuid === pharmacy.uuid)
      if (index !== -1) {
        this.items[index] = JSON.parse(JSON.stringify(pharmacy))
      }
    },
    remove(uuid: UUID) {
      this.items = this.items.filter((p) => p.uuid !== uuid)
    },
    setCurrent(pharmacy: EmergencyPharmacy) {
      this.current = JSON.parse(JSON.stringify(pharmacy))
    },
    clearCurrent() {
      this.current = undefined
    },
    startLoading() {
      this.isLoading = true
      this.error = null
    },
    stopLoading() {
      this.isLoading = false
    },
    setError(error: string) {
      this.error = error
      this.isLoading = false
    }
  }
})
