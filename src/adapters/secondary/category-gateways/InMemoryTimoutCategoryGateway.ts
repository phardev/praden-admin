import { Category } from '@core/entities/category'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { UUID } from '@core/types/types'
import { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'
import { InMemoryCategoryGateway } from '@adapters/secondary/category-gateways/InMemoryCategoryGateway'

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
}
