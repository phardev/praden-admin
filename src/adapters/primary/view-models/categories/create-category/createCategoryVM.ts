import type { Field } from '@adapters/primary/view-models/promotions/create-promotion/createPromotionVM'
import type { UUID } from '@core/types/types'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { GetCategoryVM } from '@adapters/primary/view-models/categories/get-category/getCategoryVM'
import { useCategoryStore } from '@store/categoryStore'

export class CreateCategoryVM extends GetCategoryVM {
  constructor(key: string) {
    super(key)
  }

  getName(): Field<string> {
    return {
      ...super.getName(),
      canEdit: true
    }
  }
  setName(name: string): void {
    this.formStore.set(this.key, { name })
  }

  getParentUuid(): Field<UUID | undefined> {
    return {
      ...super.getParentUuid(),
      canEdit: true
    }
  }
  setParentUuid(parentUuid: UUID | undefined): void {
    this.formStore.set(this.key, { parentUuid })
  }

  getDescription(): Field<string> {
    return {
      ...super.getDescription(),
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

export const createCategoryVM = (key: string) => {
  const categoryStore = useCategoryStore()
  categoryStore.resetCurrent()
  return new CreateCategoryVM(key)
}
