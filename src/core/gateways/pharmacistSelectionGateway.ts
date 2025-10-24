import { PharmacistSelection } from '@core/entities/pharmacistSelection'
import { UUID } from '@core/types/types'

export interface PharmacistSelectionGateway {
  get(): Promise<PharmacistSelection>
  update(productUuids: Array<UUID>): Promise<PharmacistSelection>
}
