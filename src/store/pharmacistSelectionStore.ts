import { UUID } from '@core/types/types'
import { defineStore } from 'pinia'

export const usePharmacistSelectionStore = defineStore(
  'PharmacistSelectionStore',
  {
    state: () => {
      return {
        productUuids: [] as Array<UUID>,
        isLoading: false,
        error: null as string | null
      }
    },
    actions: {
      setSelection(productUuids: Array<UUID>) {
        this.productUuids = JSON.parse(JSON.stringify(productUuids))
        this.error = null
      },
      clearSelection() {
        this.productUuids = []
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
