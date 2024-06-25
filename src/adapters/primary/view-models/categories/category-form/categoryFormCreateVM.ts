import type { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { CategoryFormFieldsReader } from '@adapters/primary/view-models/categories/category-form/categoryFormGetVM'
import { FormInitializer } from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { useFormStore } from '@store/formStore'
import { FormFieldsWriter } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  CategoryFormVM,
  CategoryProductItemVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormVM'
import { UUID } from '@core/types/types'

export class CategoryFormFieldsWriter extends FormFieldsWriter {
  protected fieldsReader: CategoryFormFieldsReader

  constructor(key: string, fieldsReader: CategoryFormFieldsReader) {
    super(key)
    this.fieldsReader = fieldsReader
  }

  addProducts(uuids: Array<UUID>) {
    const products = this.fieldsReader.get('products')
    const productsSet = new Set<UUID>(products)
    uuids.forEach((uuid) => productsSet.add(uuid))
    super.set('products', [...productsSet])
  }

  removeProducts(uuids: Array<UUID>) {
    let products = this.fieldsReader.get('products')
    products = products.filter((p: string) => !uuids.includes(p))
    super.set('products', products)
  }
}

export class NewCategoryFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
  }

  init() {
    this.formStore.set(this.key, {
      name: '',
      description: '',
      parentUuid: undefined,
      products: []
    })
  }
}

export class CategoryFormCreateVM extends CategoryFormVM {
  private fieldsWriter: CategoryFormFieldsWriter

  constructor(
    initializer: NewCategoryFormInitializer,
    fieldsReader: CategoryFormFieldsReader,
    fieldsWriter: CategoryFormFieldsWriter,
    key: string
  ) {
    super(fieldsReader, key)
    initializer.init()
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

  set(fieldName: string, value: any): void {
    this.fieldsWriter.set(fieldName, value)
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

  addProducts(uuids: Array<UUID>) {
    this.fieldsWriter.addProducts(uuids)
  }

  removeProducts(cip13: Array<string>) {
    this.fieldsWriter.removeProducts(cip13)
  }

  getDto(): CreateCategoryDTO {
    return {
      name: this.fieldsReader.get('name'),
      parentUuid: this.fieldsReader.get('parentUuid'),
      description: this.fieldsReader.get('description'),
      productsAdded: this.fieldsReader.get('products')
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}

export const categoryFormCreateVM = (key: string): CategoryFormCreateVM => {
  const initializer = new NewCategoryFormInitializer(key)
  const reader = new CategoryFormFieldsReader(key)
  const writer = new CategoryFormFieldsWriter(key, reader)
  return new CategoryFormCreateVM(initializer, reader, writer, key)
}
