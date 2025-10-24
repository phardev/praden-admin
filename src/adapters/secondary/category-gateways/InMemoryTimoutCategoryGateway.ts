import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'
import { Category } from '@core/entities/category'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'

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
}
