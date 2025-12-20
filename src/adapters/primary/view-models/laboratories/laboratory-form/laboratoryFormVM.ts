import {
  LaboratoryFormFieldsReader,
  LaboratoryProductItemVM
} from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormGetVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { useLaboratoryStore } from '@store/laboratoryStore'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'

export interface LaboratoryAvailableProductItemVM
  extends LaboratoryProductItemVM {
  laboratory: string
}

export abstract class LaboratoryFormVM {
  protected fieldsReader: LaboratoryFormFieldsReader
  protected readonly key: string

  protected constructor(fieldReader: LaboratoryFormFieldsReader, key: string) {
    this.fieldsReader = fieldReader
    this.key = key
  }

  getProductsHeaders(): Array<Header> {
    return [
      {
        name: 'Nom',
        value: 'name'
      },
      {
        name: 'Référence',
        value: 'reference'
      },
      {
        name: 'Catégories',
        value: 'categories'
      }
    ]
  }

  getAvailableProductsHeaders(): Array<Header> {
    return [
      ...this.getProductsHeaders(),
      {
        name: 'Laboratoire',
        value: 'laboratory'
      }
    ]
  }

  getProductsVM(): Array<LaboratoryProductItemVM> {
    const addedProducts = this.fieldsReader.get('products')
    return addedProducts.map((p: ProductListItem) => {
      return {
        uuid: p.uuid,
        name: p.name,
        reference: p.ean13,
        categories: p.categories.map((c) => c.name)
      }
    })
  }

  getAvailableProducts() {
    const productStore = useProductStore()
    const allProducts = productStore.items
    const searchStore = useSearchStore()
    const filteredProducts: Array<ProductListItem> = searchStore.get(this.key)
    const addedProducts = this.fieldsReader.get('products')
    const res = (filteredProducts || allProducts).filter(
      (p: ProductListItem) =>
        !addedProducts.map((p: ProductListItem) => p.uuid).includes(p.uuid)
    )
    return {
      value: res.map((p: ProductListItem) => {
        return {
          uuid: p.uuid,
          name: p.name,
          reference: p.ean13,
          categories: p.categories.map((c) => c.name),
          laboratory: p.laboratory ? p.laboratory.name : ''
        }
      }),
      canEdit: true
    }
  }

  isLoading() {
    const laboratoryStore = useLaboratoryStore()
    return laboratoryStore.isLoading
  }
}
