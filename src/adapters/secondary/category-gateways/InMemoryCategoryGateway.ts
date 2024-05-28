import { CategoryGateway } from '@core/gateways/categoryGateway'
import { Category } from '@core/entities/category'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { UUID } from '@core/types/types'
import { ParentCategoryDoesNotExistsError } from '@core/usecases/promotions/promotion-creation/ParentCategoryDoesNotExistsError'

export class InMemoryCategoryGateway implements CategoryGateway {
  private categories: Array<Category> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(): Promise<Array<Category>> {
    return Promise.resolve(this.categories)
  }

  create(dto: CreateCategoryDTO): Promise<Category> {
    if (dto.parentUuid && !this.categoryExists(dto.parentUuid)) {
      throw new ParentCategoryDoesNotExistsError(dto.parentUuid)
    }
    const category: Category = {
      ...dto,
      uuid: this.uuidGenerator.generate()
    }
    this.categories.push(category)
    return Promise.resolve(category)
  }

  private categoryExists(uuid: UUID) {
    return this.categories.findIndex((c) => c.uuid === uuid) >= 0
  }

  feedWith(...categories: Array<Category>) {
    this.categories = categories
  }
}
