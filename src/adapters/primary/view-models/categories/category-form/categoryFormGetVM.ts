import {
  CategoryFormVM,
  CategoryProductItemVM
} from '@adapters/primary/view-models/categories/category-form/categoryFormVM'
import { CreateProductCategoriesVM } from '@adapters/primary/view-models/products/product-form/productFormCreateVM'
import {
  FormFieldsReader,
  FormInitializer
} from '@adapters/primary/view-models/products/product-form/productFormGetVM'
import { Field } from '@adapters/primary/view-models/promotions/promotion-form/promotionFormCreateVM'
import type { Category, CategoryStatus } from '@core/entities/category'
import { useCategoryStore } from '@store/categoryStore'
import { useFormStore } from '@store/formStore'

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
    let category = this.categoryStore.current?.category
    if (category) {
      category = JSON.parse(JSON.stringify(category))
    }
    this.formStore.set(this.key, {
      name: category.name,
      description: category.description,
      parentUuid: category.parentUuid,
      miniature: category.miniature,
      newMiniature: undefined,
      image: category.image,
      newImage: undefined,
      products: this.categoryStore.current?.products || []
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
    const currentCategory = this.categoryStore.current?.category?.uuid
    const filtered = categories.filter(
      (c: Category) => c.uuid !== currentCategory
    )
    return filtered.map((c: Category) => {
      return {
        uuid: c.uuid,
        name: c.name
      }
    })
  }

  getCurrentCategoryStatus(): CategoryStatus | undefined {
    return this.categoryStore.current?.category?.status
  }
}

export class CategoryFormGetVM extends CategoryFormVM {
  protected initializer: ExistingCategoryFormInitializer

  constructor(
    initializer: ExistingCategoryFormInitializer,
    fieldReader: CategoryFormFieldsReader,
    key: string
  ) {
    super(fieldReader, key)
    this.initializer = initializer
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

  getProducts(): Field<Array<CategoryProductItemVM>> {
    return {
      value: super.getCategoryProductsVM(),
      canEdit: false
    }
  }

  getDisplayValidate(): boolean {
    return false
  }

  getCanValidate(): boolean {
    return false
  }

  getStatus(): Field<CategoryStatus | undefined> {
    return {
      value: this.fieldsReader.getCurrentCategoryStatus(),
      canEdit: false
    }
  }
}

export const categoryFormGetVM = (key: string): CategoryFormGetVM => {
  const initializer = new ExistingCategoryFormInitializer(key)
  const reader = new CategoryFormFieldsReader(key)
  return new CategoryFormGetVM(initializer, reader, key)
}
