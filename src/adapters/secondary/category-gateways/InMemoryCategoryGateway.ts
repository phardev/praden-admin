import { CategoryGateway } from '@core/gateways/categoryGateway'
import { Category } from '@core/entities/category'

export class InMemoryCategoryGateway implements CategoryGateway {
  private categories: Array<Category> = []

  list(): Promise<Array<Category>> {
    return Promise.resolve(this.categories)
  }

  feedWith(...categories: Array<Category>) {
    this.categories = categories
  }
}
