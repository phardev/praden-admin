import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { getFileContent } from '@utils/file'

export class InMemoryProductGateway implements ProductGateway {
  private products: Array<Product> = []

  async list(): Promise<Array<Product>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.products)))
  }

  async batch(cip13s: Array<string>): Promise<Array<Product>> {
    const res = this.products.filter((p) => cip13s.includes(p.cip13))
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const images: Array<string> = []
    for (const image of dto.images) {
      images.push(await getFileContent(image))
    }
    const product: Product = {
      name: dto.name,
      cip7: dto.cip7,
      cip13: dto.cip13,
      ean13: dto.ean13,
      miniature: '',
      images,
      categoryUuid: dto.categoryUuid,
      priceWithoutTax: parseFloat(dto.priceWithoutTax) * 100,
      percentTaxRate: parseFloat(dto.percentTaxRate),
      location: dto.location,
      availableStock: parseInt(dto.availableStock),
      laboratory: dto.laboratory,
      description: dto.description,
      instructionsForUse: dto.instructionsForUse,
      composition: dto.composition
    }
    this.products.push(product)
    return Promise.resolve(product)
  }

  feedWith(...products: Array<Product>) {
    this.products = products
  }
}
