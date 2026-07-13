import { RelayPoint } from '@core/entities/relayPoint'

export const dpdRelayPointAlesCentre: RelayPoint = {
  id: 'FR12345',
  name: 'Tabac de la Gare',
  address: '12 avenue Carnot',
  zipCode: '30100',
  city: 'Alès',
  distanceInMeters: 250,
  openingHours: [
    { day: 'Lundi', hours: '08:00-19:00' },
    { day: 'Mardi', hours: '08:00-19:00' }
  ]
}

export const dpdRelayPointAlesNord: RelayPoint = {
  id: 'FR67890',
  name: 'Presse du Centre',
  address: '5 rue de la République',
  zipCode: '30100',
  city: 'Alès',
  distanceInMeters: 640
}
