import { Product } from '@core/entities/product'
import { useFormStore } from '@store/formStore'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import { useProductStore } from '@store/productStore'

export interface ProductForDisplay {
  uuid: string
  name: string
  miniature: string
  priceWithoutTax: number
  percentTaxRate: number
}

const FORM_KEY = 'pharmacist-selection-form'

export const pharmacistSelectionFormVM = () => {
  const pharmacistSelectionStore = usePharmacistSelectionStore()
  const productStore = useProductStore()
  const formStore = useFormStore()

  formStore.set(FORM_KEY, {
    productUuids: [...pharmacistSelectionStore.productUuids]
  })

  const toProductForDisplay = (product: Product): ProductForDisplay => ({
    uuid: product.uuid,
    name: product.name,
    miniature: product.miniature,
    priceWithoutTax: product.priceWithoutTax,
    percentTaxRate: product.percentTaxRate
  })

  const getFormProductUuids = (): Array<string> => {
    return formStore.get(FORM_KEY)?.productUuids || []
  }

  const addProduct = (productUuid: string) => {
    const currentUuids = getFormProductUuids()
    formStore.set(FORM_KEY, { productUuids: [...currentUuids, productUuid] })
  }

  const removeProduct = (productUuid: string) => {
    const currentUuids = getFormProductUuids()
    formStore.set(FORM_KEY, {
      productUuids: currentUuids.filter((uuid) => uuid !== productUuid)
    })
  }

  const reorder = (oldIndex: number, newIndex: number) => {
    const currentUuids = getFormProductUuids()
    const reordered = [...currentUuids]
    const [movedItem] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, movedItem)
    formStore.set(FORM_KEY, { productUuids: reordered })
  }

  const formatPrice = (priceInCents: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceInCents / 100)
  }

  const getProductUuids = (): Array<string> => {
    return getFormProductUuids()
  }

  const reset = () => {
    formStore.set(FORM_KEY, {
      productUuids: [...pharmacistSelectionStore.productUuids]
    })
  }

  return {
    get selectedProducts() {
      const productUuids = getFormProductUuids()
      return productUuids
        .map((uuid) => productStore.items.find((p) => p.uuid === uuid))
        .filter((p): p is Product => p !== undefined)
        .map(toProductForDisplay)
    },
    get hasChanges() {
      const formUuids = getFormProductUuids()
      const storeUuids = pharmacistSelectionStore.productUuids
      return JSON.stringify(formUuids) !== JSON.stringify(storeUuids)
    },
    isLoading: pharmacistSelectionStore.isLoading || productStore.isLoading,
    isSaving: pharmacistSelectionStore.isLoading,
    addProduct,
    removeProduct,
    reorder,
    formatPrice,
    getProductUuids,
    reset
  }
}
