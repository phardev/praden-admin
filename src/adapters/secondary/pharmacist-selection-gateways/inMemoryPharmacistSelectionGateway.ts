import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { PharmacistSelectionGateway } from '@core/gateways/pharmacistSelectionGateway'

export class InMemoryPharmacistSelectionGateway
  implements PharmacistSelectionGateway
{
  private selection: Array<PharmacistSelection> = []
  private error: Error | null = null

  async get(): Promise<Array<PharmacistSelection>> {
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.selection)))
  }

  async update(selection: Array<PharmacistSelection>): Promise<void> {
    if (this.error) {
      return Promise.reject(this.error)
    }
    this.selection = JSON.parse(JSON.stringify(selection))
    return Promise.resolve()
  }

  feedWith(...selection: Array<PharmacistSelection>) {
    this.selection = JSON.parse(JSON.stringify(selection))
    this.error = null
  }

  feedWithError(error: Error) {
    this.error = error
  }
}
