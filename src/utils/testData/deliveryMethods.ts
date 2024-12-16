import { DeliveryMethod, DeliveryType } from '@core/entities/order'

export const clickAndCollect: DeliveryMethod = {
  uuid: 'clickAndCollect',
  name: 'click & collect',
  description: '198 avenue des Frères Lumières 30100 Alès',
  priceRanges: [],
  type: DeliveryType.ClickAndCollect
}

export const deliveryInRelayPoint: DeliveryMethod = {
  uuid: 'deliveryInRelayPoint',
  name: 'Livraison en point relai',
  description: '10 avenue du champ de mars',
  priceRanges: [
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
  ],
  type: DeliveryType.Delivery
}

export const express: DeliveryMethod = {
  uuid: 'express-uuid',
  name: 'Express',
  description: '2-5 jours ouvrés',
  priceRanges: [
    {
      minWeight: 0,
      maxWeight: 1000,
      price: 500
    },
    {
      minWeight: 1000,
      maxWeight: 2000,
      price: 750
    },
    {
      minWeight: 2000,
      maxWeight: 3000,
      price: 1000
    }
  ],
  type: DeliveryType.Delivery
}
