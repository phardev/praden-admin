import { RelayPoint, RelayPointSearchParams } from '@core/entities/relayPoint'
import { DpdPickupGateway } from '@core/gateways/dpdPickupGateway'

export class InMemoryDpdPickupGateway implements DpdPickupGateway {
  private points: Array<RelayPoint> = []

  search(params: RelayPointSearchParams): Promise<Array<RelayPoint>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.points)))
  }

  feedWith(...points: Array<RelayPoint>) {
    this.points = points
  }
}
