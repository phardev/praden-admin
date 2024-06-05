import { LocationGateway } from '@core/gateways/locationGateway'
import { Location } from '@core/entities/location'

export class InMemoryLocationGateway implements LocationGateway {
  private locations: Array<Location> = []

  list(): Promise<Array<Location>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.locations)))
  }

  feedWith(...locations: Array<Location>) {
    this.locations = locations
  }
}
