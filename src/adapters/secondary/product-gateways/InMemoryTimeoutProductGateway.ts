import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'
import { Category } from '@core/entities/category'
import { Product } from '@core/entities/product'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { UUID } from '@core/types/types'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { ProductListItem } from '@core/usecases/product/product-listing/productListItem'

export class InMemoryTimeoutProductGateway extends InMemoryProductGateway {
  private readonly timeoutInMs: number

  constructor(timeoutInMs: number, uuidGenerator: UuidGenerator) {
    super(uuidGenerator)
    this.timeoutInMs = timeoutInMs
  }

  override async list(limit: number, offset: number): Promise<Array<ProductListItem>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.list(limit, offset))
      }, this.timeoutInMs)
    })
  }

  override async count(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.count())
      }, this.timeoutInMs)
    })
  }

  override async batch(uuids: Array<UUID>): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.batch(uuids))
      }, this.timeoutInMs)
    })
  }

  override async create(dto: CreateProductDTO): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.create(dto))
      }, this.timeoutInMs)
    })
  }

  override async edit(uuid: UUID, dto: EditProductDTO): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.edit(uuid, dto))
      }, this.timeoutInMs)
    })
  }

  override bulkEdit(
    dto: EditProductDTO,
    uuids: Array<UUID>
  ): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.bulkEdit(dto, uuids))
      }, this.timeoutInMs)
    })
  }

  override getByUuid(uuid: UUID): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByUuid(uuid))
      }, this.timeoutInMs)
    })
  }

  override getByCategoryUuid(
    limit: number,
    offset: number,
    categoryUuid: UUID
  ): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByCategoryUuid(limit, offset, categoryUuid))
      }, this.timeoutInMs)
    })
  }

  override getByLaboratoryUuid(laboratoryUuid: UUID): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByLaboratoryUuid(laboratoryUuid))
      }, this.timeoutInMs)
    })
  }

  override addProductsToCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.addProductsToCategory(category, productUuids))
      }, this.timeoutInMs)
    })
  }

  override removeProductsFromCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.removeProductsFromCategory(category, productUuids))
      }, this.timeoutInMs)
    })
  }
}
