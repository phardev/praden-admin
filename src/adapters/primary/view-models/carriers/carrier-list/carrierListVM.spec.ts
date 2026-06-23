import { useDeliveryMethodStore } from '@store/deliveryMethodStore'
import {
  clickAndCollect,
  deliveryInRelayPoint,
  deliveryInRelayPointDPD,
  express
} from '@utils/testData/deliveryMethods'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { getCarrierListVM } from './carrierListVM'

describe('carrierListVM', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should return empty array when no delivery method is loaded', () => {
    useDeliveryMethodStore().list([])

    expect(getCarrierListVM()).toStrictEqual([])
  })

  it('should group delivery methods by carrier with a weight/country tariff matrix', () => {
    useDeliveryMethodStore().list([
      express,
      deliveryInRelayPoint,
      deliveryInRelayPointDPD,
      clickAndCollect
    ])

    expect(getCarrierListVM()).toStrictEqual([
      {
        uuid: 'carrier-colissimo',
        name: 'Colissimo',
        type: 'COLISSIMO',
        deliveryMethods: [
          {
            uuid: 'express-uuid',
            name: 'Express',
            delay: '2-5 jours ouvrés',
            hasPriceRanges: true,
            countries: ['France', 'Belgique'],
            rows: [
              {
                weightRange: '0 - 0,25 kg',
                prices: { France: '5,00\u00A0€', Belgique: '9,00\u00A0€' }
              },
              {
                weightRange: '0,25 - 1 kg',
                prices: { France: '7,50\u00A0€', Belgique: '11,50\u00A0€' }
              },
              {
                weightRange: '1 - 2 kg',
                prices: { France: '10,00\u00A0€', Belgique: '14,00\u00A0€' }
              }
            ]
          },
          {
            uuid: 'deliveryInRelayPoint',
            name: 'Livraison en point relai',
            delay: '2-5 jours ouvrés',
            hasPriceRanges: true,
            countries: ['France'],
            rows: [
              { weightRange: '0 - 1 kg', prices: { France: '2,50\u00A0€' } },
              { weightRange: '1 - 2 kg', prices: { France: '6,50\u00A0€' } },
              { weightRange: '2 - 3 kg', prices: { France: '8,00\u00A0€' } }
            ]
          }
        ]
      },
      {
        uuid: 'carrier-dpd',
        name: 'Dpd',
        type: 'DPD',
        deliveryMethods: [
          {
            uuid: 'deliveryInRelayPointDPD',
            name: 'Livraison en point relai DPD',
            delay: '24 à 72h',
            hasPriceRanges: true,
            countries: ['France'],
            rows: [
              { weightRange: '0 - 1 kg', prices: { France: '1,50\u00A0€' } },
              { weightRange: '1 - 2 kg', prices: { France: '3,50\u00A0€' } },
              { weightRange: '2 - 3 kg', prices: { France: '5,00\u00A0€' } }
            ]
          }
        ]
      },
      {
        uuid: 'carrier-pharmacy',
        name: 'Pharmacie',
        type: 'NONE',
        deliveryMethods: [
          {
            uuid: 'clickAndCollect',
            name: 'click & collect',
            delay: null,
            hasPriceRanges: false,
            countries: [],
            rows: []
          }
        ]
      }
    ])
  })
})
