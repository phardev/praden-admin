import { Category } from '@core/entities/category'
import { Product } from '@core/entities/product'
import { ProductGateway } from '@core/gateways/productGateway'
import { UUID } from '@core/types/types'
import { EditProductDTO } from '../product-edition/editProduct'
import { ProductListItem } from '../product-listing/productListItem'
import { CreateProductDTO } from './createProduct'

/* eslint-disable @typescript-eslint/no-unused-vars */

export class InMemoryFailProductGateway implements ProductGateway {
  private errorMessage = ''

  list(limit: number, offset: number): Promise<Array<ProductListItem>> {
    throw new Error(this.errorMessage)
  }

  count(): Promise<number> {
    throw new Error(this.errorMessage)
  }

  batch(uuids: Array<UUID>): Promise<Array<Product>> {
    throw new Error(this.errorMessage)
  }

  create(dto: CreateProductDTO): Promise<Product> {
    throw new Error(this.errorMessage)
  }

  edit(uuid: UUID, dto: EditProductDTO): Promise<Product> {
    throw new Error(this.errorMessage)
  }

  bulkEdit(dto: EditProductDTO, uuids: Array<UUID>): Promise<Array<Product>> {
    throw new Error(this.errorMessage)
  }

  getByUuid(uuid: UUID): Promise<Product> {
    throw new Error(this.errorMessage)
  }

  getByCategoryUuid(
    limit: number,
    offset: number,
    categoryUuid: UUID
  ): Promise<Array<Product>> {
    throw new Error(this.errorMessage)
  }

  getByLaboratoryUuid(laboratoryUuid: UUID): Promise<Array<Product>> {
    throw new Error(this.errorMessage)
  }

  addProductsToCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    throw new Error(this.errorMessage)
  }

  removeProductsFromCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>> {
    throw new Error(this.errorMessage)
  }

  feedErrorMessageWith(errorMessage: string) {
    this.errorMessage = errorMessage
  }
}
/* eslint-disable @typescript-eslint/no-unused-vars */
