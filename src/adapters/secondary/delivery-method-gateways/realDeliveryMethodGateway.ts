import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'
import { DeliveryMethod } from '@core/entities/order'
import { DeliveryMethodGateway } from '../../../core/gateways/deliveryMethodGateway'
import { RealGateway } from '../order-gateways/RealOrderGateway'

export class RealDeliveryMethodGateway
  extends RealGateway
  implements DeliveryMethodGateway
{
  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async list(): Promise<Array<DeliveryMethod>> {
    const res = await axiosWithBearer.get(`${this.baseUrl}/delivery-methods`)
    return res.data
  }
}
