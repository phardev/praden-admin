import { PharmacistSelection } from '@core/entities/pharmacistSelection'

export interface PharmacistSelectionGateway {
  get(): Promise<Array<PharmacistSelection>>
  update(selection: Array<PharmacistSelection>): Promise<void>
}
