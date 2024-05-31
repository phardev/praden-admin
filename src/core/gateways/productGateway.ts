import { Product } from '../entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'
import { UUID } from '@core/types/types'

export interface ProductGateway {
  list(): Promise<Array<Product>>
  batch(cip13s: Array<string>): Promise<Array<Product>>
  create(dto: CreateProductDTO): Promise<Product>
  getByUuid(uuid: UUID): Promise<Product>
}
