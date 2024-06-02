import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { CreateProductCategoriesVM } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import type { Category } from '@core/entities/category'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'

export class ExistingCategoryFormInitializer implements FormInitializer {
  protected readonly key: string
  protected formStore: any
  protected categoryStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.categoryStore = useCategoryStore()
  }

  init() {
    let category = this.categoryStore.current
    if (category) {
      category = JSON.parse(JSON.stringify(category))
    }
    this.formStore.set(this.key, {
      name: category.name,
      description: category.description,
      parentUuid: category.parentUuid
    })
  }
}

export class CategoryFormFieldsReader extends FormFieldsReader {
  protected categoryStore: any

  constructor(key: string) {
    super(key)
    this.categoryStore = useCategoryStore()
  }

  getAvailableCategories(): CreateProductCategoriesVM {
    const categories = this.categoryStore.items
    return categories.map((c: Category) => {
      return {
        uuid: c.uuid,
        name: c.name
      }
    })
  }
}

export class CategoryFormGetVM {
  protected initializer: ExistingCategoryFormInitializer
  protected fieldsReader: CategoryFormFieldsReader

  constructor(
    initializer: ExistingCategoryFormInitializer,
    fieldReader: CategoryFormFieldsReader
  ) {
    this.initializer = initializer
    this.fieldsReader = fieldReader
    initializer.init()
  }

  get(fieldName: string): any {
    return this.createField(fieldName)
  }

  private createField<T>(fieldName: string): Field<T> {
    return {
      value: this.fieldsReader.get(fieldName),
      canEdit: false
    }
  }

  getAvailableCategories(): CreateProductCategoriesVM {
    return this.fieldsReader.getAvailableCategories()
  }

  getDisplayValidate(): boolean {
    return false
  }

  getCanValidate(): boolean {
    return false
  }
}

export const categoryFormGetVM = (key: string): CategoryFormGetVM => {
  const initializer = new ExistingCategoryFormInitializer(key)
  const reader = new CategoryFormFieldsReader(key)
  return new CategoryFormGetVM(initializer, reader)
}
