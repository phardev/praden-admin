import { RelayPoint, RelayPointSearchParams } from '@core/entities/relayPoint'

export interface DpdPickupGateway {
  search(params: RelayPointSearchParams): Promise<Array<RelayPoint>>
}
