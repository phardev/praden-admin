import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import { CreateProductCategoriesVM } from '@adapters/primary/view-models/products/create-product/createProductVM'
import type { Category } from '@core/entities/category'
import { UUID } from '@core/types/types'

export type FormReaderFunction<T> = () => T
export type FormWriterFunction<T> = (value: T) => void

export interface ReaderCategoryFormFields {
  getName: FormReaderFunction<string>
  getDescription: FormReaderFunction<string>
  getParentUuid: FormReaderFunction<UUID | undefined>
}

export class GetCategoryVM {
  protected readonly key: string
  protected formStore: any
  protected categoryStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.categoryStore = useCategoryStore()
    let category = this.categoryStore.current
    if (category) {
      category = JSON.parse(JSON.stringify(category))
    }
    this.formStore.set(this.key, {
      name: category ? category.name : '',
      description: category ? category.description : '',
      parentUuid: category ? category.parentUuid : undefined
    })
  }

  getName(): Field<string> {
    return {
      value: this.formStore.get(this.key).name,
      canEdit: false
    }
  }

  getDescription(): Field<string> {
    return {
      value: this.formStore.get(this.key).description,
      canEdit: false
    }
  }

  getAvailableCategories(): CreateProductCategoriesVM {
    const categories = JSON.parse(JSON.stringify(this.categoryStore.items))
    const filteredCategory = this.categoryStore.current
      ? categories.filter((c) => c.uuid !== this.categoryStore.current.uuid)
      : categories
    return filteredCategory.map((c: Category) => {
      return {
        uuid: c.uuid,
        name: c.name
      }
    })
  }

  getParentUuid(): Field<string> {
    return {
      value: this.formStore.get(this.key).parentUuid,
      canEdit: false
    }
  }

  getCanValidate(): boolean {
    return false
  }

  getDisplayValidate(): boolean {
    return false
  }
}

export const getCategoryVM = (key: string): GetCategoryVM => {
  return new GetCategoryVM(key)
}
