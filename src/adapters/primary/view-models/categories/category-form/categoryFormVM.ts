import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useProductStore } from '@store/productStore'
import { Product } from '@core/entities/product'
import { useSearchStore } from '@store/searchStore'
import { UUID } from '@core/types/types'
import { CategoryFormFieldsReader } from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'

export interface CategoryProductItemVM {
  uuid: UUID
  name: string
  reference: string
  laboratory: string
}

export interface CategoryAvailableProductItemVM extends CategoryProductItemVM {
  category: string
}

export abstract class CategoryFormVM {
  protected fieldsReader: CategoryFormFieldsReader
  private readonly key: string

  protected constructor(fieldReader: CategoryFormFieldsReader, key: string) {
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
        name: 'Laboratoire',
        value: 'laboratory'
      }
    ]
  }

  getAvailableProductsHeaders(): Array<Header> {
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
        name: 'Catégorie',
        value: 'category'
      },
      {
        name: 'Laboratoire',
        value: 'laboratory'
      }
    ]
  }

  getCategoryProductsVM(): Array<CategoryProductItemVM> {
    const addedProducts = this.fieldsReader.get('products')
    const productStore = useProductStore()
    const allProducts: Array<Product> = productStore.items
    return addedProducts.map((uuid: string) => {
      const p: Product = allProducts.find((p) => p.uuid === uuid)
      return {
        uuid: p.uuid,
        name: p.name,
        reference: p.cip13,
        laboratory: p.laboratory
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
      (p) => !addedProducts.includes(p.uuid)
    )
    return {
      value: res.map((p: Product) => {
        return {
          uuid: p.uuid,
          name: p.name,
          reference: p.cip13,
          category: p.category ? p.category.name : '',
          laboratory: p.laboratory
        }
      }),
      canEdit: true
    }
  }
}
