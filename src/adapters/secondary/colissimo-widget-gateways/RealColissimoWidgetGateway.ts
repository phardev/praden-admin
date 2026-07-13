import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { ColissimoWidgetGateway } from '@core/gateways/colissimoWidgetGateway'

export class RealColissimoWidgetGateway
  extends RealGateway
  implements ColissimoWidgetGateway
{
  constructor(url: string) {
    super(url)
  }

  async getToken(): Promise<string> {
    const res = await axiosWithBearer.post(
      `${this.baseUrl}/colissimo/widget-token`
    )
    return res.data.token
  }
}
