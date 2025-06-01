import { DeliveryMethod } from '@core/entities/order'
import { DeliveryMethodGateway } from '../../../core/gateways/deliveryMethodGateway'

export class InMemoryDeliveryMethodGateway implements DeliveryMethodGateway {
  private deliveryMethods: Array<DeliveryMethod> = []

  list(): Promise<Array<DeliveryMethod>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.deliveryMethods)))
  }

  feedWith(...deliveryMethods: Array<DeliveryMethod>) {
    this.deliveryMethods = deliveryMethods
  }
}
