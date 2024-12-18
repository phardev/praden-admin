import { CategoryFormFieldsWriter } from '@adapters/primary/view-models/categories/category-form/categoryFormCreateVM'
import {
  CategoryFormFieldsReader,
  ExistingCategoryFormInitializer
} from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'
import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import {
  CategoryFormVM,
  CategoryProductItemVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormVM'
import { UUID } from '@core/types/types'
import { Product } from '@core/entities/product'
import { useProductStore } from '@store/productStore'
import { useSearchStore } from '@store/searchStore'

export class CategoryFormEditVM extends CategoryFormVM {
  private fieldsWriter: CategoryFormFieldsWriter
  private initialProducts: Array<Product>

  constructor(
    initializer: ExistingCategoryFormInitializer,
    fieldsReader: CategoryFormFieldsReader,
    fieldsWriter: CategoryFormFieldsWriter,
    key: string
  ) {
    super(fieldsReader, key)
    initializer.init()
    this.fieldsWriter = fieldsWriter
    this.initialProducts = JSON.parse(
      JSON.stringify(this.fieldsReader.get('products'))
    )
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  getAvailableCategories(): any {
    return this.fieldsReader.getAvailableCategories()
  }

  getProducts(): Field<Array<CategoryProductItemVM>> {
    return {
      value: super.getCategoryProductsVM(),
      canEdit: true
    }
  }

  async set(fieldName: string, value: any): Promise<void> {
    await this.fieldsWriter.set(fieldName, value)
  }

  addProducts(uuids: Array<UUID>) {
    const products = this.fieldsReader.get('products')
    const productStore = useProductStore()
    const searchStore = useSearchStore()
    const searchResult = searchStore.get(this.key)
    const alreadyAdded = products.map((p) => p.uuid)
    uuids
      .filter((uuid) => !alreadyAdded.includes(uuid))
      .forEach((uuid) => {
        let product = productStore.getByUuid(uuid)
        if (!product) {
          product = searchResult.find((p) => p.uuid === uuid)
        }
        products.push(product)
      })
    this.fieldsWriter.addProducts(uuids)
  }

  removeProducts(uuids: Array<UUID>) {
    this.fieldsWriter.removeProducts(uuids)
  }

  getDto(): EditCategoryDTO {
    const products = this.fieldsReader.get('products')
    const initialProductsUuids = this.initialProducts.map(
      (p: Product) => p.uuid
    )
    const productsUuids = products.map((p: Product) => p.uuid)
    const productsAdded = productsUuids.filter(
      (uuid) => !initialProductsUuids.includes(uuid)
    )
    const productsRemoved = initialProductsUuids.filter(
      (uuid) => !productsUuids.includes(uuid)
    )
    return {
      name: this.fieldsReader.get('name'),
      parentUuid: this.fieldsReader.get('parentUuid'),
      description: this.fieldsReader.get('description'),
      miniature: this.fieldsReader.get('miniature'),
      newMiniature: this.fieldsReader.get('newMiniature'),
      image: this.fieldsReader.get('image'),
      newImage: this.fieldsReader.get('newImage'),
      productsAdded,
      productsRemoved
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const categoryFormEditVM = (key: string) => {
  const initializer = new ExistingCategoryFormInitializer(key)
  const reader = new CategoryFormFieldsReader(key)
  const writer = new CategoryFormFieldsWriter(key, reader)
  return new CategoryFormEditVM(initializer, reader, writer, key)
}
