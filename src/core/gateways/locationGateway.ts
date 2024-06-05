import { Location } from '@core/entities/location'

export interface LocationGateway {
  list(): Promise<Array<Location>>
}
