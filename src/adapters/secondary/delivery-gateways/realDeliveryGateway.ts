import { RealGateway } from '@adapters/secondary/order-gateways/RealOrderGateway'
import { Delivery } from '@core/entities/delivery'
import { DeliveryGateway } from '@core/gateways/deliveryGateway'
import { UUID } from '@core/types/types'
import { axiosWithBearer } from '@adapters/primary/nuxt/utils/axios'

export class RealDeliveryGateway
  extends RealGateway
  implements DeliveryGateway
{
  constructor(url: string) {
    super(url)
  }

  list(): Promise<Array<Delivery>> {
    throw new Error('Method not implemented.')
  }
  async printLabel(uuid: UUID): Promise<void> {
    await axiosWithBearer.post(`${this.baseUrl}/deliveries/${uuid}/print-label`)
  }
}
