import { Carrier, CarrierType } from '@core/entities/carrier'

export const pharmacy: Carrier = {
  uuid: 'carrier-pharmacy',
  name: 'Pharmacie',
  type: CarrierType.None
}

export const colissimo: Carrier = {
  uuid: 'carrier-colissimo',
  name: 'Colissimo',
  type: CarrierType.Colissimo
}

export const dpd: Carrier = {
  uuid: 'carrier-dpd',
  name: 'Dpd',
  type: CarrierType.DPD
}
