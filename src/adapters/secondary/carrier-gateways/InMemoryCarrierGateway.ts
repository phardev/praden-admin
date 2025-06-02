import { Carrier } from '@core/entities/carrier'
import { CarrierGateway } from '@core/gateways/carrierGateway'

export class InMemoryCarrierGateway implements CarrierGateway {
  private carriers: Array<Carrier> = []

  list(): Promise<Array<Carrier>> {
    return Promise.resolve(JSON.parse(JSON.stringify(this.carriers)))
  }

  feedWith(...carriers: Array<Carrier>) {
    this.carriers = carriers
  }
}
