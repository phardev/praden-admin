import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { useCategoryStore } from '@store/categoryStore'
import { Category } from '@core/entities/category'
import { UUID } from '@core/types/types'

export interface GetCategoriesItemVM {
  uuid: UUID
  name: string
  description: string
}

export interface GetCategoriesVM {
  headers: Array<Header>
  items: Array<GetCategoriesItemVM>
}

export const getCategoriesVM = (): GetCategoriesVM => {
  const categoryStore = useCategoryStore()
  const categories = categoryStore.items

  const headers: Array<Header> = [
    {
      name: 'Nom',
      value: 'name'
    },
    {
      name: 'Description',
      value: 'description'
    }
  ]

  return {
    headers,
    items: categories.map((c: Category) => {
      return {
        uuid: c.uuid,
        name: c.name,
        description: c.description
      }
    })
  }
}
