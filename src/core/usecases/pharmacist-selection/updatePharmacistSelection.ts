import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { PharmacistSelectionGateway } from '@core/gateways/pharmacistSelectionGateway'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'

export const updatePharmacistSelection = async (
  selection: Array<PharmacistSelection>,
  pharmacistSelectionGateway: PharmacistSelectionGateway
): Promise<void> => {
  const pharmacistSelectionStore = usePharmacistSelectionStore()
  try {
    pharmacistSelectionStore.startLoading()
    await pharmacistSelectionGateway.update(selection)
    pharmacistSelectionStore.setSelection(selection)
    pharmacistSelectionStore.stopLoading()
  } catch (error) {
    pharmacistSelectionStore.setError(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
