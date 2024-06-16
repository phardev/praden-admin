import { LocationGateway } from '@core/gateways/locationGateway'
import { Location } from '@core/entities/location'
import { UUID } from '@core/types/types'
import { LocationDoesNotExistsError } from '@core/errors/LocationDoesNotExistsError'

export class InMemoryLocationGateway implements LocationGateway {
  private locations: Array<Location> = []

  list(): Promise<Array<Location>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.locations)))
  }

  getByUuid(uuid: UUID): Promise<Location> {
    const res = this.locations.find((c) => c.uuid === uuid)
    if (!res) throw new LocationDoesNotExistsError(uuid)
    return Promise.resolve(JSON.parse(JSON.stringify(res)))
  }

  feedWith(...locations: Array<Location>) {
    this.locations = locations
  }
}
