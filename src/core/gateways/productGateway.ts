import { Product } from '../entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { UUID } from '@core/types/types'
import { EditProductDTO } from '@core/usecases/product/product-edition/editProduct'

export interface ProductGateway {
  list(): Promise<Array<Product>>
  batch(cip13s: Array<string>): Promise<Array<Product>>
  create(dto: CreateProductDTO): Promise<Product>
  edit(uuid: UUID, dto: EditProductDTO): Promise<Product>
  getByUuid(uuid: UUID): Promise<Product>
}
