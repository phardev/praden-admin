import { DeliveryMethod, DeliveryType } from '@core/entities/order'
import { colissimo, dpd, pharmacy } from './carriers'

export const clickAndCollect: DeliveryMethod = {
  uuid: 'clickAndCollect',
  name: 'click & collect',
  description: '198 avenue des Frères Lumières 30100 Alès',
  priceRanges: {},
  carrier: pharmacy,
  type: DeliveryType.ClickAndCollect
}

export const deliveryInRelayPoint: DeliveryMethod = {
  uuid: 'deliveryInRelayPoint',
  name: 'Livraison en point relai',
  description: '10 avenue du champ de mars',
  delay: '2-5 jours ouvrés',
  priceRanges: {
    FRANCE: [
      {
        minWeight: 0,
        maxWeight: 1000,
        price: 250
      },
      {
        minWeight: 1000,
        maxWeight: 2000,
        price: 650
      },
      {
        minWeight: 2000,
        maxWeight: 3000,
        price: 800
      }
    ]
  },
  carrier: colissimo,
  type: DeliveryType.Delivery
}

export const deliveryInRelayPointDPD: DeliveryMethod = {
  uuid: 'deliveryInRelayPointDPD',
  name: 'Livraison en point relai DPD',
  description: 'Relais dpd',
  delay: '24 à 72h',
  priceRanges: {
    FRANCE: [
      {
        minWeight: 0,
        maxWeight: 1000,
        price: 150
      },
      {
        minWeight: 1000,
        maxWeight: 2000,
        price: 350
      },
      {
        minWeight: 2000,
        maxWeight: 3000,
        price: 500
      }
    ]
  },
  carrier: dpd,
  type: DeliveryType.Delivery
}

export const express: DeliveryMethod = {
  uuid: 'express-uuid',
  name: 'Express',
  description: '2-5 jours ouvrés',
  delay: '2-5 jours ouvrés',
  priceRanges: {
    FRANCE: [
      {
        minWeight: 0,
        maxWeight: 250,
        price: 500
      },
      {
        minWeight: 250,
        maxWeight: 1000,
        price: 750
      },
      {
        minWeight: 1000,
        maxWeight: 2000,
        price: 1000
      }
    ],
    BELGIQUE: [
      {
        minWeight: 0,
        maxWeight: 250,
        price: 900
      },
      {
        minWeight: 250,
        maxWeight: 1000,
        price: 1150
      },
      {
        minWeight: 1000,
        maxWeight: 2000,
        price: 1400
      }
    ]
  },
  carrier: colissimo,
  type: DeliveryType.Delivery
}
