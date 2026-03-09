import { Customer } from '@core/entities/customer'
import { Order } from '@core/entities/order'
import { Product } from '@core/entities/product'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'
import { SearchProductsFilters } from '@core/usecases/product/product-searching/searchProducts'

export interface SearchProductsResult {
  items: Array<Product>
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
  hasMore: boolean
}

export interface SearchGateway {
  searchProducts(filters: SearchProductsFilters): Promise<SearchProductsResult>
  indexProducts(limit: number, offset: number): Promise<number>
  searchOrders(dto: SearchOrdersDTO): Promise<Array<Order>>
  searchCustomers(dto: SearchCustomersDTO): Promise<Array<Customer>>
}
