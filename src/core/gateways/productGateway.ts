import { Product } from '../entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'

export interface ProductGateway {
  list(): Promise<Array<Product>>
  create(dto: CreateProductDTO): Promise<Product>
}
