import { useFormStore } from '@store/formStore'
import { useCategoryStore } from '@store/categoryStore'
import type { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import type { Category } from '@core/entities/category'
import { CreateProductCategoriesVM } from '@adapters/primary/view-models/products/create-product/createProductVM'
import type { UUID } from '@core/types/types'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'

export class CreateCategoryVM {
  protected readonly key: string
  protected formStore: any
  protected categoryStore: any

  constructor(key: string) {
    this.key = key
    this.formStore = useFormStore()
    this.categoryStore = useCategoryStore()
    this.formStore.set(this.key, {
      name: '',
      description: '',
      parentUuid: undefined
    })
  }

  getName(): Field<string> {
    return {
      value: this.formStore.get(this.key).name,
      canEdit: true
    }
  }
  setName(name: string): void {
    this.formStore.set(this.key, { name })
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

  getParentUuid(): Field<UUID | undefined> {
    return {
      value: this.formStore.get(this.key).parentUuid,
      canEdit: true
    }
  }
  setParentUuid(parentUuid: UUID | undefined): void {
    this.formStore.set(this.key, { parentUuid })
  }

  getDescription(): Field<string> {
    return {
      value: this.formStore.get(this.key).description,
      canEdit: true
    }
  }
  setDescription(description: string): void {
    this.formStore.set(this.key, { description })
  }

  getDto(): CreateCategoryDTO {
    const formValue = this.formStore.get(this.key)
    return {
      name: formValue.name,
      parentUuid: formValue.parentUuid,
      description: formValue.description
    }
  }

  getDisplayValidate(): boolean {
    return true
  }

  getCanValidate(): boolean {
    return true
  }
}
