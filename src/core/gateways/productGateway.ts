import { Product } from '../entities/product'
import { CreateProductDTO } from '@core/usecases/product/product-creation/createProduct'

export interface ProductGateway {
  list(): Promise<Array<Product>>
  batch(cip13s: Array<string>): Promise<Array<Product>>
  create(dto: CreateProductDTO): Promise<Product>
}
