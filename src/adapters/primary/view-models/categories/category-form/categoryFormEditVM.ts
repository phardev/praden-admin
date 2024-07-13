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

export class CategoryFormEditVM extends CategoryFormVM {
  private fieldsWriter: CategoryFormFieldsWriter
  private initialProducts: Array<UUID>

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
    this.fieldsWriter.addProducts(uuids)
  }

  removeProducts(uuids: Array<UUID>) {
    this.fieldsWriter.removeProducts(uuids)
  }

  getDto(): EditCategoryDTO {
    const products = this.fieldsReader.get('products')
    const productsAdded = products.filter(
      (uuid) => !this.initialProducts.includes(uuid)
    )
    const productsRemoved = this.initialProducts.filter(
      (uuid) => !products.includes(uuid)
    )
    return {
      name: this.fieldsReader.get('name'),
      parentUuid: this.fieldsReader.get('parentUuid'),
      description: this.fieldsReader.get('description'),
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
