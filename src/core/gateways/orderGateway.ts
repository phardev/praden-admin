import { Order } from '@core/entities/order'
import { UUID } from '@core/types/types'

export interface OrderGateway {
  list(): Promise<Array<Order>>
  listOrdersToPrepare(): Promise<Array<Order>>
  startPreparation(uuid: UUID): Promise<Order>
  getByUuid(uuid: UUID): Promise<Order>
  validatePreparation(preparation: Order): Promise<Order>
  savePreparation(preparation: Order): Promise<Order>
  askHowToFinish(preparation: Order): Promise<Order>
  cancelPreparation(preparation: Order): Promise<Order>
  batch(uuids: Array<UUID>): Promise<Array<Order>>
}
