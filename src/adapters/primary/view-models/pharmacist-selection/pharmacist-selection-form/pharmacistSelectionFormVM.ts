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
    productUuids: pharmacistSelectionStore.selection.map((item) => item.uuid)
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

  const getSelection = () => {
    const productUuids = getFormProductUuids()
    return productUuids
      .map((uuid, index) => {
        const item = pharmacistSelectionStore.selection.find(
          (s) => s.uuid === uuid
        )
        if (item) {
          return {
            ...item,
            order: index
          }
        }

        const product = productStore.items.find((p) => p.uuid === uuid)
        if (product) {
          const price = Math.round(
            product.priceWithoutTax * (1 + product.percentTaxRate / 100)
          )
          return {
            uuid: product.uuid,
            name: product.name,
            miniature: product.miniature,
            priceWithoutTax: product.priceWithoutTax,
            percentTaxRate: product.percentTaxRate,
            price,
            availableStock: product.availableStock,
            weight: 0,
            laboratory: product.laboratory?.name,
            isMedicine: product.isMedicine,
            flags: product.flags,
            promotions: [],
            order: index
          }
        }

        return null
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  }

  const reset = () => {
    formStore.set(FORM_KEY, {
      productUuids: pharmacistSelectionStore.selection.map((item) => item.uuid)
    })
  }

  return {
    get selectedProducts() {
      const productUuids = getFormProductUuids()
      return productUuids
        .map((uuid) => {
          const selectionItem = pharmacistSelectionStore.selection.find(
            (item) => item.uuid === uuid
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

          const product = productStore.items.find((p) => p.uuid === uuid)
          if (product) {
            return {
              uuid: product.uuid,
              name: product.name,
              miniature: product.miniature,
              priceWithoutTax: product.priceWithoutTax,
              percentTaxRate: product.percentTaxRate
            }
          }

          return null
        })
        .filter((item): item is ProductForDisplay => item !== null)
    },
    get hasChanges() {
      const formUuids = getFormProductUuids()
      const storeUuids = pharmacistSelectionStore.selection.map(
        (item) => item.uuid
      )
      return JSON.stringify(formUuids) !== JSON.stringify(storeUuids)
    },
    get isLoading() {
      return pharmacistSelectionStore.isLoading || productStore.isLoading
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
