import { PharmacistSelectionGateway } from '@core/gateways/pharmacistSelectionGateway'
import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { UUID } from '@core/types/types'

export class InMemoryPharmacistSelectionGateway
  implements PharmacistSelectionGateway
{
  private selection: PharmacistSelection = { productUuids: [] }
  private error: Error | null = null

  async get(): Promise<PharmacistSelection> {
    if (this.error) {
      return Promise.reject(this.error)
    }
    return Promise.resolve(JSON.parse(JSON.stringify(this.selection)))
  }

  async update(productUuids: Array<UUID>): Promise<PharmacistSelection> {
    if (this.error) {
      return Promise.reject(this.error)
    }
    this.selection = { productUuids }
    return Promise.resolve(JSON.parse(JSON.stringify(this.selection)))
  }

  feedWith(selection: PharmacistSelection) {
    this.selection = JSON.parse(JSON.stringify(selection))
    this.error = null
  }

  feedWithError(error: Error) {
    this.error = error
  }
}
