import { Category, CategoryStatus } from '@core/entities/category'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UUID } from '@core/types/types'
import { useCategoryStore } from '@store/categoryStore'

function getCategoryDescendants(
  uuid: UUID,
  categories: Array<Category>
): Array<Category> {
  const childrenMap = new Map<UUID, Array<Category>>()
  for (const cat of categories) {
    if (cat.parentUuid) {
      const siblings = childrenMap.get(cat.parentUuid) ?? []
      childrenMap.set(cat.parentUuid, [...siblings, cat])
    }
  }

  const result: Array<Category> = []
  const traverse = (parentUuid: UUID) => {
    const children = childrenMap.get(parentUuid) ?? []
    for (const child of children) {
      result.push(child)
      traverse(child.uuid)
    }
  }

  traverse(uuid)
  return result
}

export const toggleCategoryStatus = async (
  uuid: UUID,
  categoryGateway: CategoryGateway
): Promise<void> => {
  const categoryStore = useCategoryStore()
  const category = await categoryGateway.getByUuid(uuid)
  const allCategories = await categoryGateway.list()

  const newStatus =
    category.status === CategoryStatus.Active
      ? CategoryStatus.Inactive
      : CategoryStatus.Active

  const descendants = getCategoryDescendants(uuid, allCategories)
  const categoriesToUpdate = [category, ...descendants]

  for (const cat of categoriesToUpdate) {
    const updated = await categoryGateway.edit(cat.uuid, { status: newStatus })
    categoryStore.edit(updated)
  }
}
