import {
  LaboratoryFormFieldsReader,
  LaboratoryProductItemVM
} from '@adapters/primary/view-models/laboratories/laboratory-form/laboratoryFormGetVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { Product } from '@core/entities/product'
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
    return addedProducts.map((p: Product) => {
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
    const allProducts: Array<Product> = productStore.items
    const searchStore = useSearchStore()
    const filteredProducts: Array<Product> = searchStore.get(this.key)
    const addedProducts = this.fieldsReader.get('products')
    const res = (filteredProducts || allProducts).filter(
      (p) => !addedProducts.map((p) => p.uuid).includes(p.uuid)
    )
    return {
      value: res.map((p: Product) => {
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
}
