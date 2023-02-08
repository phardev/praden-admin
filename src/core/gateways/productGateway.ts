import { Product } from '../entities/product'

export interface ProductGateway {
  list(): Promise<Array<Product>>
}
