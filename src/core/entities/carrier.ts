import type { UUID } from '@core/types/types'

export enum CarrierType {
  Colissimo = 'COLISSIMO',
  DPD = 'DPD',
  None = 'NONE'
}

export interface Carrier {
  uuid: UUID
  name: string
  type: CarrierType
}
