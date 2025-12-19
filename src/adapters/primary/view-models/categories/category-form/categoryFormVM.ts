import { CategoryFormFieldsReader } from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import type { Product } from '@core/entities/product'
import type { ProductListItem } from '@core/usecases/product/product-listing/productListItem'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'

export interface CategoryProductItemVM {
  uuid: UUID
  name: string
  reference: string
  categories: Array<string>
  laboratory: string
}

export type CategoryAvailableProductItemVM = CategoryProductItemVM

export abstract class CategoryFormVM {
  protected fieldsReader: CategoryFormFieldsReader
  protected readonly key: string

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
        name: 'Catégories',
        value: 'categories'
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
        name: 'Catégories',
        value: 'categories'
      },
      {
        name: 'Laboratoire',
        value: 'laboratory'
      }
    ]
  }

  getCategoryProductsVM(): Array<CategoryProductItemVM> {
    const addedProducts = this.fieldsReader.get('products')
    return addedProducts.map((p: Product) => {
      return {
        uuid: p.uuid,
        name: p.name,
        reference: p.ean13,
        categories: p.categories.map((c) => c.name),
        laboratory: p.laboratory ? p.laboratory.name : ''
      }
    })
  }

  getAvailableProducts() {
    const productStore = useProductStore()
    const allProducts: Array<ProductListItem> = productStore.items
    const searchStore = useSearchStore()
    const filteredProducts: Array<ProductListItem> = searchStore.get(this.key)
    const addedProducts = this.fieldsReader.get('products')
    const res = (filteredProducts || allProducts).filter(
      (p: ProductListItem) =>
        !addedProducts.map((p: Product) => p.uuid).includes(p.uuid)
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
  isLoading(): boolean {
    const categoryStore = useCategoryStore()
    return categoryStore.isLoading
  }
}
