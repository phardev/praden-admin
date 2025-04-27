import { DeliveryMethod } from '@core/entities/order'

export interface DeliveryMethodGateway {
  list(): Promise<Array<DeliveryMethod>>
}
