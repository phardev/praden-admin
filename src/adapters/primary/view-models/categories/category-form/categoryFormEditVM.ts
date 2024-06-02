import { CategoryFormFieldsWriter } from '@adapters/primary/view-models/categories/category-form/categoryFormCreateVM'
import {
  CategoryFormFieldsReader,
  ExistingCategoryFormInitializer
} from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'
import type { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'

export class CategoryFormEditVM {
  private fieldsReader: CategoryFormFieldsReader
  private fieldsWriter: CategoryFormFieldsWriter

  constructor(
    initializer: ExistingCategoryFormInitializer,
    fieldsReader: CategoryFormFieldsReader,
    fieldsWriter: CategoryFormFieldsWriter
  ) {
    initializer.init()
    this.fieldsReader = fieldsReader
    this.fieldsWriter = fieldsWriter
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: true
    }
  }

  getAvailableCategories(): any {
    return this.fieldsReader.getAvailableCategories()
  }

  set(fieldName: string, value: any): void {
    this.fieldsWriter.set(fieldName, value)
  }

  getDto(): EditCategoryDTO {
    return {
      name: this.fieldsReader.get('name'),
      parentUuid: this.fieldsReader.get('parentUuid'),
      description: this.fieldsReader.get('description')
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
  const writer = new CategoryFormFieldsWriter(key)
  return new CategoryFormEditVM(initializer, reader, writer)
}
