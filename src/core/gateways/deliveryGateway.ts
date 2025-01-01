import { Delivery } from '@core/entities/order'

export interface DeliveryGateway {
  list(): Promise<Array<Delivery>>
}
