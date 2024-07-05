import { Order } from '@core/entities/order'
import { Product } from '@core/entities/product'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'

export interface SearchGateway {
  searchProducts(query: string): Promise<Array<Product>>
  searchOrders(dto: SearchOrdersDTO): Promise<Array<Order>>
}
