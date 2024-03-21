import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { getFileContent } from '@utils/file'

export class InMemoryProductGateway implements ProductGateway {
  private products: Array<Product> = []

  async list(): Promise<Array<Product>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.products)))
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const images: Array<string> = []
    for (const image of dto.images) {
      images.push(await getFileContent(image))
    }
    const product: Product = {
      name: dto.name,
      cip13: dto.cip13,
      miniature: '',
      images,
      categoryUuid: dto.categoryUuid,
      priceWithoutTax: parseFloat(dto.priceWithoutTax) * 100,
      percentTaxRate: parseFloat(dto.percentTaxRate),
      location: dto.location,
      availableStock: parseInt(dto.availableStock),
      laboratory: dto.laboratory
    }
    this.products.push(product)
    return Promise.resolve(product)
  }

  feedWith(...products: Array<Product>) {
    this.products = products
  }
}
