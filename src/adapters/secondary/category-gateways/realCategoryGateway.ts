import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { CategoryGateway } from '@core/gateways/categoryGateway'
import { Category } from '@core/entities/category'
import axios from 'axios'

export class RealCategoryGateway
  extends RealGateway
  implements CategoryGateway
{
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Category>> {
    const res = await axios.get(`${this.baseUrl}/categories/`)
    return Promise.resolve(res.data.items)
  }
}
