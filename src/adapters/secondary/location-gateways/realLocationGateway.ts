import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { sortByOrder } from '@core/entities/banner'
import { Location } from '@core/entities/location'
import { LocationGateway } from '@core/gateways/locationGateway'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealLocationGateway
  extends RealGateway
  implements LocationGateway
{
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async list(): Promise<Array<Location>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/locations`)
    return res.data.sort(sortByOrder)
  }
}
