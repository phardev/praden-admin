import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'

export class InMemoryProductGateway implements ProductGateway {
  private products: Array<Product> = []

  async list(): Promise<Array<Product>> {
    return Promise.resolve(this.products)
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const product: Product = {
      ...dto
    }
    this.products.push(product)
    return Promise.resolve(product)
  }

  feedWith(...products: Array<Product>) {
    this.products = products
  }
}
