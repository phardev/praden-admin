import { Header } from '../../preparations/get-orders-to-prepare/getPreparationsVM'
import { useDeliveryStore } from '@store/deliveryStore'
import { UUID } from '@core/types/types'
import { DeliveryStatus } from '@core/entities/delivery'

export interface GetDeliveriesItemsVM {
  uuid: UUID
  method: string
  client: string
  trackingNumber: string
  status: DeliveryStatus
}

export interface GetDeliveriesVM {
  headers: Array<Header>
  items: Array<GetDeliveriesItemsVM>
  isLoading: boolean
}

export const getDeliveriesVM = (): GetDeliveriesVM => {
  const headers = [
    {
      name: 'Méthode',
      value: 'method'
    },
    {
      name: 'Client',
      value: 'client'
    },
    {
      name: 'Numéro de suivi',
      value: 'trackingNumber'
    },
    {
      name: 'Statut',
      value: 'status'
    }
  ]

  const deliveryStore = useDeliveryStore()

  return {
    headers,
    items: deliveryStore.items.map((d) => {
      return {
        uuid: d.uuid,
        method: d.method.name,
        client: `${d.receiver.address.firstname} ${d.receiver.address.lastname}`,
        trackingNumber: d.trackingNumber ?? '',
        status: d.status
      }
    }),
    isLoading: deliveryStore.isLoading
  }
}
