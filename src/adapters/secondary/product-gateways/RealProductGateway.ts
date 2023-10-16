import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { ProductGateway } from '@core/gateways/productGateway'
import { Product } from '@core/entities/product'
import axios from 'axios'

export class RealProductGateway extends RealGateway implements ProductGateway {
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Product>> {
    const res = await axios.get(`${this.baseUrl}/products/`)
    return Promise.resolve(res.data.items)
  }
}
