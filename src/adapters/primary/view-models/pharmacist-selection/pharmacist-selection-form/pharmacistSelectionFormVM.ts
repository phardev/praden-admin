import { useFormStore } from '@store/formStore'
import { usePharmacistSelectionStore } from '@store/pharmacistSelectionStore'
import { useSearchStore } from '@store/searchStore'

export interface ProductForDisplay {
  uuid: string
  name: string
  miniature: string
  priceWithoutTax: number
  percentTaxRate: number
}

const FORM_KEY = 'pharmacist-selection-form'
const SEARCH_NAMESPACE = 'pharmacist-selection-modal'

export const pharmacistSelectionFormVM = () => {
  const pharmacistSelectionStore = usePharmacistSelectionStore()
  const formStore = useFormStore()
  const searchStore = useSearchStore()

  const initialItems: Array<ProductForDisplay> =
    pharmacistSelectionStore.selection.map((item) => ({
      uuid: item.uuid,
      name: item.name,
      miniature: item.miniature,
      priceWithoutTax: item.priceWithoutTax,
      percentTaxRate: item.percentTaxRate
    }))

  formStore.set(FORM_KEY, { items: initialItems })

  const getFormItems = (): Array<ProductForDisplay> => {
    return formStore.get(FORM_KEY)?.items || []
  }

  const findProductData = (productUuid: string): ProductForDisplay | null => {
    const selectionItem = pharmacistSelectionStore.selection.find(
      (item) => item.uuid === productUuid
    )
    if (selectionItem) {
      return {
        uuid: selectionItem.uuid,
        name: selectionItem.name,
        miniature: selectionItem.miniature,
        priceWithoutTax: selectionItem.priceWithoutTax,
        percentTaxRate: selectionItem.percentTaxRate
      }
    }

    const searchResults = searchStore.get(SEARCH_NAMESPACE) || []
    const searchProduct = searchResults.find((p: any) => p.uuid === productUuid)
    if (searchProduct) {
      return {
        uuid: searchProduct.uuid,
        name: searchProduct.name,
        miniature: searchProduct.miniature,
        priceWithoutTax: searchProduct.priceWithoutTax,
        percentTaxRate: searchProduct.percentTaxRate
      }
    }

    return null
  }

  const addProduct = (productUuid: string) => {
    const currentItems = getFormItems()
    const productData = findProductData(productUuid)
    if (productData) {
      formStore.set(FORM_KEY, { items: [...currentItems, productData] })
    }
  }

  const removeProduct = (productUuid: string) => {
    const currentItems = getFormItems()
    formStore.set(FORM_KEY, {
      items: currentItems.filter((item) => item.uuid !== productUuid)
    })
  }

  const reorder = (oldIndex: number, newIndex: number) => {
    const currentItems = getFormItems()
    const reordered = [...currentItems]
    const [movedItem] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, movedItem)
    formStore.set(FORM_KEY, { items: reordered })
  }

  const formatPrice = (priceInCents: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(priceInCents / 100)
  }

  const getProductUuids = (): Array<string> => {
    return getFormItems().map((item) => item.uuid)
  }

  const getSelection = () => {
    return getFormItems().map((item, index) => {
      const fullItem = pharmacistSelectionStore.selection.find(
        (s) => s.uuid === item.uuid
      )
      if (fullItem) {
        return {
          ...fullItem,
          order: index
        }
      }

      const price = Math.round(
        item.priceWithoutTax * (1 + item.percentTaxRate / 100)
      )
      return {
        uuid: item.uuid,
        name: item.name,
        miniature: item.miniature,
        priceWithoutTax: item.priceWithoutTax,
        percentTaxRate: item.percentTaxRate,
        price,
        availableStock: 0,
        weight: 0,
        laboratory: undefined,
        isMedicine: false,
        flags: {},
        promotions: [],
        order: index
      }
    })
  }

  const reset = () => {
    const resetItems: Array<ProductForDisplay> =
      pharmacistSelectionStore.selection.map((item) => ({
        uuid: item.uuid,
        name: item.name,
        miniature: item.miniature,
        priceWithoutTax: item.priceWithoutTax,
        percentTaxRate: item.percentTaxRate
      }))
    formStore.set(FORM_KEY, { items: resetItems })
  }

  return {
    get selectedProducts() {
      return getFormItems()
    },
    get hasChanges() {
      const formUuids = getFormItems().map((item) => item.uuid)
      const storeUuids = pharmacistSelectionStore.selection.map(
        (item) => item.uuid
      )
      return JSON.stringify(formUuids) !== JSON.stringify(storeUuids)
    },
    get isLoading() {
      return pharmacistSelectionStore.isLoading
    },
    get isSaving() {
      return pharmacistSelectionStore.isLoading
    },
    addProduct,
    removeProduct,
    reorder,
    formatPrice,
    getProductUuids,
    getSelection,
    reset
  }
}
