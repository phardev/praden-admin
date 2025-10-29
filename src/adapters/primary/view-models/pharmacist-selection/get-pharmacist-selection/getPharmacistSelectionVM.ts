import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'

export interface GetPharmacistSelectionVM {
  selection: Array<PharmacistSelection>
  isLoading: boolean
  error: string | null
}

export const getPharmacistSelectionVM = (): GetPharmacistSelectionVM => {
  const pharmacistSelectionStore = usePharmacistSelectionStore()

  return {
    selection: pharmacistSelectionStore.selection,
    isLoading: pharmacistSelectionStore.isLoading,
    error: pharmacistSelectionStore.error
  }
}
