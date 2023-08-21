import { SearchGateway } from '@core/gateways/searchGateway'
import { isProduct, Product } from '@core/entities/product'
import { isCategory } from '@core/entities/category'
import '@utils/strings'

export class FakeSearchGateway implements SearchGateway {
  private items: Array<any> = []

  searchProducts(query: string): Promise<Array<Product>> {
    const products = this.items.filter((i) => isProduct(i))
    const res = products.filter((i) => {
      const categories = this.items.filter((i) => isCategory(i))
      const category = categories.find((c) => c.uuid === i.categoryUuid)
      const isCategoryNameMatching = category
        ? category.name.includesWithoutCase(query)
        : false
      const isNameMatching = i.name.includesWithoutCase(query)
      const isLaboratoryMatching = i.laboratory.includesWithoutCase(query)
      return isNameMatching || isLaboratoryMatching || isCategoryNameMatching
    })
    return Promise.resolve(res)
  }

  feedWith(...items: Array<any>) {
    this.items = items
  }
}
