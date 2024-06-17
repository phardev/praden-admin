import { Location } from '@core/entities/location'
import { UUID } from '@core/types/types'

export interface LocationGateway {
  list(): Promise<Array<Location>>
  getByUuid(uuid: UUID): Promise<Location>
}
