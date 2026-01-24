import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import type { Category, CategoryStatus } from '@core/entities/category'
import type { UuidGenerator } from '@core/gateways/uuidGenerator'
import type { UUID } from '@core/types/types'
import type { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import type { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'

export class InMemoryTimoutCategoryGateway extends InMemoryCategoryGateway {
  private readonly timeoutInMs: number

  constructor(timeoutInMs: number, uuidGenerator: UuidGenerator) {
    super(uuidGenerator)
    this.timeoutInMs = timeoutInMs
  }

  override list(): Promise<Array<Category>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.list())
      }, this.timeoutInMs)
    })
  }

  override create(dto: CreateCategoryDTO): Promise<Category> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.create(dto))
      }, this.timeoutInMs)
    })
  }

  override edit(uuid: UUID, dto: Partial<EditCategoryDTO>): Promise<Category> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.edit(uuid, dto))
      }, this.timeoutInMs)
    })
  }

  override getByUuid(uuid: UUID): Promise<Category> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByUuid(uuid))
      }, this.timeoutInMs)
    })
  }

  override reorder(categoryUuids: Array<UUID>): Promise<Array<Category>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.reorder(categoryUuids))
      }, this.timeoutInMs)
    })
  }

  override updateStatus(
    uuid: UUID,
    status: CategoryStatus
  ): Promise<Array<Category>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.updateStatus(uuid, status))
      }, this.timeoutInMs)
    })
  }
}
