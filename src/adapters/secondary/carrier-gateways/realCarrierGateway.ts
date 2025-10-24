import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { Carrier } from '@core/entities/carrier'
import { CarrierGateway } from '@core/gateways/carrierGateway'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealCarrierGateway extends RealGateway implements CarrierGateway {
  constructor(url: string) {
    super(url)
  }

  async list(): Promise<Array<Carrier>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/carriers/`)
    return Promise.resolve(res.data.items)
  }
}
