import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Customer } from '@core/entities/customer'
import { Order } from '@core/entities/order'
import { Product } from '@core/entities/product'
import { SearchGateway } from '@core/gateways/searchGateway'
import { SearchCustomersDTO } from '@core/usecases/customers/customer-searching/searchCustomer'
import { SearchOrdersDTO } from '@core/usecases/order/orders-searching/searchOrders'

export class RealSearchGateway extends RealGateway implements SearchGateway {
  constructor(url: string) {
    super(url)
  }

  async searchProducts(query: string): Promise<Array<Product>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/search/products`, {
      params: { query }
    })
    return Promise.resolve(res.data.items)
  }

  async indexProducts(limit: number, offset: number): Promise<number> {
    const res = await axiosWithBearer.post(`${this.baseUrl}/products/index`, {
      limit,
      offset
    })
    return Promise.resolve(res.data.length)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchOrders(dto: SearchOrdersDTO): Promise<Array<Order>> {
    return Promise.resolve([])
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchCustomers(dto: SearchCustomersDTO): Promise<Array<Customer>> {
    throw new Error('Method not implemented.')
  }
}
