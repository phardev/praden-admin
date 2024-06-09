import { CategoryGateway } from '@core/gateways/categoryGateway'
import { Category } from '@core/entities/category'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { UUID } from '@core/types/types'
import { ParentCategoryDoesNotExistsError } from '@core/errors/ParentCategoryDoesNotExistsError'
import { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'

export class InMemoryCategoryGateway implements CategoryGateway {
  private categories: Array<Category> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(): Promise<Array<Category>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.categories)))
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

  edit(uuid: UUID, category: Partial<EditCategoryDTO>): Promise<Category> {
    if (!this.categoryExists(uuid)) {
      throw new CategoryDoesNotExistsError(uuid)
    }
    if (category.parentUuid && !this.categoryExists(category.parentUuid)) {
      throw new ParentCategoryDoesNotExistsError(uuid)
    }
    const index = this.categories.findIndex((c) => c.uuid === uuid)
    this.categories[index] = Object.assign(this.categories[index], category)
    return Promise.resolve(this.categories[index])
  }

  getByUuid(uuid: UUID): Promise<Category> {
    const res = this.categories.find((c) => c.uuid === uuid)
    if (!res) throw new CategoryDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  private categoryExists(uuid: UUID) {
    return this.categories.findIndex((c) => c.uuid === uuid) >= 0
  }

  feedWith(...categories: Array<Category>) {
    this.categories = categories
  }
}
