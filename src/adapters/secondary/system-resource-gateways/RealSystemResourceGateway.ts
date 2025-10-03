import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { SystemResourceGateway } from '@core/gateways/systemResourceGateway'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealSystemResourceGateway
  extends RealGateway
  implements SystemResourceGateway
{
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async list(): Promise<Array<string>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/resources`)
    return res.data
  }
}
