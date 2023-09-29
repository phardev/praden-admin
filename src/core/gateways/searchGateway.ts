import { Product } from '@core/entities/product'

export interface SearchGateway {
  searchProducts(query: string): Promise<Array<Product>>
}
