import { CarrierType } from '@core/entities/carrier'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'
import { HashTable, UUID } from '@core/types/types'
import { useCarrierStore } from '@store/carrierStore'
import { useDeliveryStore } from '@store/deliveryStore'
import { TableVM } from '../../invoices/get-invoice/getInvoiceVM'

export interface GetDeliveriesItemsVM {
  uuid: UUID
  method: string
  client: string
  trackingNumber: string
  weight: number
  status: DeliveryStatus
}

export interface GetDeliveriesGroupVM {
  count: number
  table: TableVM<GetDeliveriesItemsVM>
}

export interface GetDeliveriesVM {
  items: HashTable<GetDeliveriesGroupVM>
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
      name: 'Poids (kg)',
      value: 'weight'
    },
    {
      name: 'Statut',
      value: 'status'
    }
  ]

  const carrierStore = useCarrierStore()

  const carriers = carrierStore.items
  const deliveryCarriers = carriers.filter((c) => c.type !== CarrierType.None)

  const groups = deliveryCarriers.map((c) => {
    return {
      name: c.name,
      filter: (d: Delivery) => d.method.carrier.type === c.type,
      headers
    }
  })

  const deliveryStore = useDeliveryStore()

  return {
    items: filterDeliveriesByCarrier(groups),
    isLoading: deliveryStore.isLoading
  }
}

export const filterDeliveriesByCarrier = (
  groups: any
): HashTable<GetDeliveriesGroupVM> => {
  const deliveryStore = useDeliveryStore()
  const res: HashTable<GetDeliveriesGroupVM> = {}
  groups.forEach((group: any) => {
    const filteredItems = deliveryStore.items.filter(group.filter)
    const items = filteredItems.map((d: Delivery) => {
      return {
        uuid: d.uuid,
        method: d.method.name,
        client: `${d.receiver.address.firstname} ${d.receiver.address.lastname}`,
        trackingNumber: d.trackingNumber ?? '',
        weight: d.weight / 1000,
        status: d.status
      }
    })
    group.items = {
      count: items.length,
      table: {
        headers: group.headers,
        items
      }
    }
    res[group.name] = {
      count: group.items.count,
      table: group.items.table
    }
  })
  return res
}
