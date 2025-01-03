import { Delivery } from '@core/entities/delivery'
import { UUID } from '@core/types/types'

export interface DeliveryGateway {
  list(): Promise<Array<Delivery>>
  ship(uuids: Array<UUID>): Promise<Array<Delivery>>
  printLabel(uuid: UUID): Promise<void>
}
