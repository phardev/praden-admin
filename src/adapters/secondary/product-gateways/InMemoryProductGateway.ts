import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { getFileContent } from '@utils/file'
import { UUID } from '@core/types/types'
import { ProductDoesNotExistsError } from '@core/errors/ProductDoesNotExistsError'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'

export class InMemoryProductGateway implements ProductGateway {
  private products: Array<Product> = []
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
  }

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
      uuid: this.uuidGenerator.generate(),
      name: dto.name,
      cip7: dto.cip7,
      cip13: dto.cip13,
      ean13: dto.ean13,
      miniature: '',
      images,
      categoryUuid: dto.categoryUuid,
      priceWithoutTax: parseFloat(dto.priceWithoutTax) * 100,
      percentTaxRate: parseFloat(dto.percentTaxRate),
      locations: dto.locations,
      availableStock: parseInt(dto.availableStock),
      laboratory: dto.laboratory,
      description: dto.description,
      instructionsForUse: dto.instructionsForUse,
      composition: dto.composition
    }
    this.products.push(product)
    return Promise.resolve(product)
  }

  edit(uuid: UUID, dto: EditProductDTO): Promise<Product> {
    const index = this.products.findIndex((c) => c.uuid === uuid)
    const locations = this.products[index].locations
    dto.locations = {
      ...locations,
      ...dto.locations
    }
    this.products[index] = Object.assign(this.products[index], dto)
    return Promise.resolve(JSON.parse(JSON.stringify(this.products[index])))
  }

  getByUuid(uuid: UUID): Promise<Product> {
    const res = this.products.find((p) => p.uuid === uuid)
    if (!res) throw new ProductDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  feedWith(...products: Array<Product>) {
    this.products = JSON.parse(JSON.stringify(products))
  }
}
