import type { RelayPoint } from '@core/entities/relayPoint'

export interface ColissimoWidgetPoint {
  identifiant: string
  nom: string
  adresse1: string
  adresse2?: string
  codePostal: string
  localite: string
}

export const mapColissimoWidgetPoint = (
  point: ColissimoWidgetPoint
): RelayPoint => {
  return {
    id: point.identifiant,
    name: point.nom,
    address: point.adresse2
      ? `${point.adresse1}, ${point.adresse2}`
      : point.adresse1,
    zipCode: point.codePostal,
    city: point.localite
  }
}
