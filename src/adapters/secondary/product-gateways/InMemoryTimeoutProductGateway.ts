import { Product } from '@core/entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { UUID } from '@core/types/types'
import { UuidGenerator } from '@core/gateways/uuidGenerator'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { Category } from '@core/entities/category'
import { InMemoryProductGateway } from '@adapters/secondary/product-gateways/InMemoryProductGateway'

export class InMemoryTimeoutProductGateway extends InMemoryProductGateway {
  private readonly timeoutInMs: number

  constructor(timeoutInMs: number, uuidGenerator: UuidGenerator) {
    super(uuidGenerator)
    this.timeoutInMs = timeoutInMs
  }

  async list(limit: number, offset: number): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.list(limit, offset))
      }, this.timeoutInMs)
    })
  }

  async count(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.count())
      }, this.timeoutInMs)
    })
  }

  async batch(uuids: Array<UUID>): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.batch(uuids))
      }, this.timeoutInMs)
    })
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.create(dto))
      }, this.timeoutInMs)
    })
  }

  async edit(uuid: UUID, dto: EditProductDTO): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.edit(uuid, dto))
      }, this.timeoutInMs)
    })
  }

  bulkEdit(dto: EditProductDTO, uuids: Array<UUID>): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.bulkEdit(dto, uuids))
      }, this.timeoutInMs)
    })
  }

  getByUuid(uuid: UUID): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByUuid(uuid))
      }, this.timeoutInMs)
    })
  }

  getByCategoryUuid(categoryUuid: UUID): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByCategoryUuid(categoryUuid))
      }, this.timeoutInMs)
    })
  }

  getByLaboratoryUuid(laboratoryUuid: UUID): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.getByLaboratoryUuid(laboratoryUuid))
      }, this.timeoutInMs)
    })
  }

  addProductsToCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(super.addProductsToCategory(category, productUuids))
      }, this.timeoutInMs)
    })
  }

  removeProductsFromCategory(
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
