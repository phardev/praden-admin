import { Product } from '../entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { UUID } from '@core/types/types'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'
import { Category } from '@core/entities/category'

export interface ProductGateway {
  list(limit: number, offset: number): Promise<Array<Product>>
  count(): Promise<number>
  batch(uuids: Array<UUID>): Promise<Array<Product>>
  create(dto: CreateProductDTO): Promise<Product>
  edit(uuid: UUID, dto: EditProductDTO): Promise<Product>
  bulkEdit(dto: EditProductDTO, uuids: Array<UUID>): Promise<Array<Product>>
  getByUuid(uuid: UUID): Promise<Product>
  getByCategoryUuid(
    limit: number,
    offset: number,
    categoryUuid: UUID
  ): Promise<Array<Product>>
  getByLaboratoryUuid(laboratoryUuid: UUID): Promise<Array<Product>>
  addProductsToCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>>
  removeProductsFromCategory(
    category: Category,
    productUuids: Array<UUID>
  ): Promise<Array<Product>>
}
