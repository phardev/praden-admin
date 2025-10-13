import { PharmacistSelectionGateway } from '@core/gateways/pharmacistSelectionGateway'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import { UUID } from '@core/types/types'

export const updatePharmacistSelection = async (
  productUuids: Array<UUID>,
  pharmacistSelectionGateway: PharmacistSelectionGateway
): Promise<void> => {
  const pharmacistSelectionStore = usePharmacistSelectionStore()
  try {
    pharmacistSelectionStore.startLoading()
    const selection = await pharmacistSelectionGateway.update(productUuids)
    pharmacistSelectionStore.setSelection(selection.productUuids)
    pharmacistSelectionStore.stopLoading()
  } catch (error) {
    pharmacistSelectionStore.setError(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
