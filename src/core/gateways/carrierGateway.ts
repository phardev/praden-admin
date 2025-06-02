import { Carrier } from '@core/entities/carrier'

export interface CarrierGateway {
  list(): Promise<Array<Carrier>>
}
