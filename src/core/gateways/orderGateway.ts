import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'

export interface OrderGateway {
  list(): Promise<Array<Order>>
  listOrdersToPrepare(): Promise<Array<Order>>
  startPreparation(uuid: UUID): Promise<Order>
  getByUuid(uuid: UUID): Promise<Order>
  validatePreparation(preparation: Order): Promise<Order>
}
