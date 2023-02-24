import { DeliveryMethod, DeliveryType } from '@core/entities/order'

export const clickAndCollect: DeliveryMethod = {
  uuid: 'clickAndCollect',
  name: 'Retrait en pharmacie',
  description: '198 avenue des Frères Lumières 30100 Alès',
  price: 0,
  type: DeliveryType.ClickAndCollect
}

export const deliveryInRelayPoint: DeliveryMethod = {
  uuid: 'deliveryInRelayPoint',
  name: 'Livraison en point relai',
  description: '10 avenue du champ de mars',
  price: 599,
  type: DeliveryType.Delivery
}
