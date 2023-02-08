import { ProductGateway } from '../../core/gateways/productGateway'
import { Product } from '../../core/entities/product'

export class InMemoryProductGateway implements ProductGateway {
  private products: Array<Product> = []

  async list(): Promise<Array<Product>> {
    return Promise.resolve(this.products)
  }

  feedWith(...products: Array<Product>) {
    this.products = products
  }
}
