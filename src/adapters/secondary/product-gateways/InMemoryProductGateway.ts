import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { getFileContent } from '@utils/file'
import { UUID } from '@core/types/types'
import { ProductDoesNotExistsError } from '@core/errors/ProductDoesNotExistsError'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { useCategoryStore } from '@store/categoryStore'

export class InMemoryProductGateway implements ProductGateway {
  private products: Array<Product> = []
  private categoryStore: any
  private uuidGenerator: UuidGenerator

  constructor(uuidGenerator: UuidGenerator) {
    this.uuidGenerator = uuidGenerator
    this.categoryStore = useCategoryStore()
  }

  async list(limit: number, offset: number): Promise<Array<Product>> {
    const res = this.products.slice(offset, offset + limit)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  async count(): Promise<number> {
    return Promise.resolve(this.products.length)
  }

  async batch(uuids: Array<UUID>): Promise<Array<Product>> {
    const res = this.products.filter((p) => uuids.includes(p.uuid))
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const images: Array<string> = []
    for (const image of dto.images) {
      images.push(await getFileContent(image))
    }
    const product: Product = {
      uuid: this.uuidGenerator.generate(),
      categories: [],
      name: dto.name,
      cip7: dto.cip7,
      cip13: dto.cip13,
      ean13: dto.ean13,
      miniature: '',
      images,
      priceWithoutTax: dto.priceWithoutTax,
      percentTaxRate: dto.percentTaxRate,
      locations: dto.locations,
      availableStock: dto.availableStock,
      laboratory: dto.laboratory,
      description: dto.description,
      instructionsForUse: dto.instructionsForUse,
      composition: dto.composition,
      weight: dto.weight
    }
    if (dto.maxQuantityForOrder) {
      product.maxQuantityForOrder = dto.maxQuantityForOrder
    }
    dto.categoryUuids.forEach((uuid) => {
      const category = this.categoryStore.getByUuid(uuid)
      if (category) {
        product.categories.push(category)
      }
    })
    this.products.push(product)
    return Promise.resolve(product)
  }

  async edit(uuid: UUID, dto: EditProductDTO): Promise<Product> {
    const index = this.products.findIndex((c) => c.uuid === uuid)
    if (dto.locations) {
      Object.assign(this.products[index].locations, dto.locations)
      delete dto.locations
    }
    if (dto.newImages) {
      const newImages: Array<string> = []
      for (const image of dto.newImages) {
        newImages.push(await getFileContent(image))
      }
      Array.prototype.push.apply(this.products[index].images, newImages)
      delete dto.newImages
    }
    if (dto.categoryUuids) {
      this.products[index].categories = []
      dto.categoryUuids.forEach((uuid) => {
        const category = this.categoryStore.getByUuid(uuid)
        if (category) {
          this.products[index].categories.push(category)
        }
      })
      delete dto.categoryUuids
    }
    this.products[index] = Object.assign(this.products[index], dto)
    return Promise.resolve(JSON.parse(JSON.stringify(this.products[index])))
  }

  getByUuid(uuid: UUID): Promise<Product> {
    const res = this.products.find((p) => p.uuid === uuid)
    if (!res) throw new ProductDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  getByCategoryUuid(categoryUuid: UUID): Promise<Array<Product>> {
    return Promise.resolve(
      this.products.filter((p) =>
        p.categories.some((c) => c.uuid === categoryUuid)
      )
    )
  }

  feedWith(...products: Array<Product>) {
    this.products = JSON.parse(JSON.stringify(products))
  }
}
