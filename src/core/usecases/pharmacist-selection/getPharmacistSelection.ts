import { PharmacistSelectionGateway } from '@core/gateways/pharmacistSelectionGateway'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'

export const getPharmacistSelection = async (
  pharmacistSelectionGateway: PharmacistSelectionGateway
): Promise<void> => {
  const pharmacistSelectionStore = usePharmacistSelectionStore()
  try {
    pharmacistSelectionStore.startLoading()
    const selection = await pharmacistSelectionGateway.get()
    pharmacistSelectionStore.setSelection(selection)
    pharmacistSelectionStore.stopLoading()
  } catch (error) {
    pharmacistSelectionStore.setError(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
