import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { defineStore } from 'pinia'

export const usePharmacistSelectionStore = defineStore(
  'PharmacistSelectionStore',
  {
    state: () => {
      return {
        selection: [] as Array<PharmacistSelection>,
        isLoading: false,
        error: null as string | null
      }
    },
    actions: {
      setSelection(selection: Array<PharmacistSelection>) {
        this.selection = JSON.parse(JSON.stringify(selection))
        this.error = null
      },
      clearSelection() {
        this.selection = []
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
  }
)
