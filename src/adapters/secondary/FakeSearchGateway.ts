import { SearchGateway } from '@core/gateways/searchGateway'
import { Product } from '@core/entities/product'

export class FakeSearchGateway implements SearchGateway {
  private items: Array<any> = []

  searchProducts(query: string): Promise<Array<Product>> {
    const res = this.items.filter((i) => {
      const isNameMatching = i.name.toLowerCase().includes(query.toLowerCase())
      const isLaboratoryMatching = i.laboratory
        .toLowerCase()
        .includes(query.toLowerCase())
      return isNameMatching || isLaboratoryMatching
    })
    return Promise.resolve(res)
  }

  feedWith(...items: Array<any>) {
    this.items = items
  }
}
