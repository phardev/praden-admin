import { Delivery } from '@core/entities/order'
import { DeliveryGateway } from '@core/gateways/deliveryGateway'

export class InMemoryDeliveryGateway implements DeliveryGateway {
  private deliveries: Array<Delivery> = []

  list(): Promise<Array<Delivery>> {
    return Promise.resolve(this.deliveries)
  }

  feedWith(...deliveries: Array<Delivery>) {
    this.deliveries = deliveries
  }
}
