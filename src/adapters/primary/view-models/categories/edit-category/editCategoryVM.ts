import { CreateCategoryVM } from '@adapters/primary/view-models/categories/create-category/createCategoryVM'

export class EditCategoryVM extends CreateCategoryVM {
  constructor(key: string) {
    super(key)
  }
}

export const editCategoryVM = (key: string) => {
  return new EditCategoryVM(key)
}
