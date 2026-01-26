import { Category } from '@core/entities/category'
import { CategoryDoesNotExistsError } from '@core/errors/CategoryDoesNotExistsError'
import { ParentCategoryDoesNotExistsError } from '@core/errors/ParentCategoryDoesNotExistsError'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { CreateCategoryDTO } from '@core/usecases/categories/category-creation/createCategory'
import { EditCategoryDTO } from '@core/usecases/categories/category-edition/editCategory'

export class InMemoryCategoryGateway implements CategoryGateway {
  private categories: Array<Category> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

  list(): Promise<Array<Category>> {
    const sorted = this.categories.sort((a, b) => a.order - b.order)
    return Promise.resolve(JSON.parse(JSON.stringify(sorted)))
  }

  create(dto: CreateCategoryDTO): Promise<Category> {
    if (dto.parentUuid && !this.categoryExists(dto.parentUuid)) {
      throw new ParentCategoryDoesNotExistsError(dto.parentUuid)
    }
    const category: Category = {
      uuid: this.uuidGenerator.generate(),
      name: dto.name,
      description: dto.description,
      order: this.categories.length,
      status: 'ACTIVE'
    }
    this.categories.push(category)
    return Promise.resolve(category)
  }

  edit(uuid: UUID, dto: Partial<EditCategoryDTO>): Promise<Category> {
    if (!this.categoryExists(uuid)) {
      throw new CategoryDoesNotExistsError(uuid)
    }
    if (dto.parentUuid && !this.categoryExists(dto.parentUuid)) {
      throw new ParentCategoryDoesNotExistsError(uuid)
    }
    const index = this.categories.findIndex((c) => c.uuid === uuid)
    const {
      productsAdded: _productsAdded,
      productsRemoved: _productsRemoved,
      ...categoryDTO
    } = dto
    this.categories[index] = Object.assign(this.categories[index], categoryDTO)
    return Promise.resolve(this.categories[index])
  }

  getByUuid(uuid: UUID): Promise<Category> {
    const res = this.categories.find((c) => c.uuid === uuid)
    if (!res) throw new CategoryDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  async reorder(categoryUuids: Array<UUID>): Promise<Array<Category>> {
    for (const uuid of categoryUuids) {
      const i = categoryUuids.indexOf(uuid)
      await this.edit(uuid, { order: i })
    }
    this.categories = this.categories.sort((a, b) => a.order - b.order)
    return Promise.resolve(JSON.parse(JSON.stringify(this.categories)))
  }

  async enable(uuid: UUID): Promise<Array<Category>> {
    const affectedCategories = this.getCategoryWithDescendants(uuid)
    for (const category of affectedCategories) {
      const index = this.categories.findIndex((c) => c.uuid === category.uuid)
      this.categories[index].status = 'ACTIVE'
    }
    return Promise.resolve(JSON.parse(JSON.stringify(affectedCategories)))
  }

  async disable(uuid: UUID): Promise<Array<Category>> {
    const affectedCategories = this.getCategoryWithDescendants(uuid)
    for (const category of affectedCategories) {
      const index = this.categories.findIndex((c) => c.uuid === category.uuid)
      this.categories[index].status = 'INACTIVE'
    }
    return Promise.resolve(JSON.parse(JSON.stringify(affectedCategories)))
  }

  private getCategoryWithDescendants(uuid: UUID): Array<Category> {
    const target = this.categories.find((c) => c.uuid === uuid)
    if (!target) throw new CategoryDoesNotExistsError(uuid)

    const descendants: Array<Category> = []
    const findDescendants = (parentUuid: UUID) => {
      const children = this.categories.filter(
        (c) => c.parentUuid === parentUuid
      )
      for (const child of children) {
        descendants.push(child)
        findDescendants(child.uuid)
      }
    }
    findDescendants(uuid)
    return [target, ...descendants]
  }

  private categoryExists(uuid: UUID) {
    return this.categories.findIndex((c) => c.uuid === uuid) >= 0
  }

  feedWith(...categories: Array<Category>) {
    this.categories = categories
  }
}
