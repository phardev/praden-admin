import { PharmacistSelectionGateway } from '@core/gateways/pharmacistSelectionGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import { useProductStore } from '@store/productStore'

export const getPharmacistSelection = async (
  pharmacistSelectionGateway: PharmacistSelectionGateway,
  productGateway: ProductGateway
): Promise<void> => {
  const pharmacistSelectionStore = usePharmacistSelectionStore()
  const productStore = useProductStore()
  try {
    pharmacistSelectionStore.startLoading()
    const selection = await pharmacistSelectionGateway.get()
    const products = await productGateway.batch(selection.productUuids)
    productStore.list(products)
    pharmacistSelectionStore.setSelection(selection.productUuids)
    pharmacistSelectionStore.stopLoading()
  } catch (error) {
    pharmacistSelectionStore.setError(
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}
