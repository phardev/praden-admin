import { Delivery } from '@core/entities/delivery'

export interface DeliveryGateway {
  list(): Promise<Array<Delivery>>
}
