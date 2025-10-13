import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import { UUID } from '@core/types/types'

export interface GetPharmacistSelectionVM {
  productUuids: Array<UUID>
  isLoading: boolean
  error: string | null
}

export const getPharmacistSelectionVM = (): GetPharmacistSelectionVM => {
  const pharmacistSelectionStore = usePharmacistSelectionStore()

  return {
    productUuids: pharmacistSelectionStore.productUuids,
    isLoading: pharmacistSelectionStore.isLoading,
    error: pharmacistSelectionStore.error
  }
}
