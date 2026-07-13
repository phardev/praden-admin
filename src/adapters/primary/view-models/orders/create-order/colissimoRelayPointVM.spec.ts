import type { RelayPoint } from '@core/entities/relayPoint'
import type { ColissimoWidgetPoint } from './colissimoRelayPointVM'
import { mapColissimoWidgetPoint } from './colissimoRelayPointVM'

describe('Colissimo relay point VM', () => {
  describe('The widget point has a single address line', () => {
    it('should map the point to a relay point', () => {
      const widgetPoint: ColissimoWidgetPoint = {
        identifiant: 'COL123',
        nom: 'Presse du Marché',
        adresse1: '4 place du Marché',
        codePostal: '30100',
        localite: 'Alès'
      }
      const expectedRelayPoint: RelayPoint = {
        id: 'COL123',
        name: 'Presse du Marché',
        address: '4 place du Marché',
        zipCode: '30100',
        city: 'Alès'
      }
      expect(mapColissimoWidgetPoint(widgetPoint)).toStrictEqual(
        expectedRelayPoint
      )
    })
  })

  describe('The widget point has a second address line', () => {
    it('should join both address lines', () => {
      const widgetPoint: ColissimoWidgetPoint = {
        identifiant: 'COL456',
        nom: 'Tabac du Centre',
        adresse1: '8 rue Haute',
        adresse2: 'Galerie du Centre',
        codePostal: '30100',
        localite: 'Alès'
      }
      const expectedRelayPoint: RelayPoint = {
        id: 'COL456',
        name: 'Tabac du Centre',
        address: '8 rue Haute, Galerie du Centre',
        zipCode: '30100',
        city: 'Alès'
      }
      expect(mapColissimoWidgetPoint(widgetPoint)).toStrictEqual(
        expectedRelayPoint
      )
    })
  })
})
