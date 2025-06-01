import { useOrderStore } from '@store/orderStore'
import {
  DeliveryType,
  getDeliveryStatus,
  getOrderStatus,
  isAnonymousOrder,
  Order,
  OrderLineStatus,
  PaymentStatus
} from '@core/entities/order'
import { AddressVM } from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'
import { useCustomerStore } from '@store/customerStore'
import { DeliveryStatus } from '@core/entities/delivery'
import { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import { UUID } from '@core/types/types'

export interface OrderCustomerVM {
  firstname: string
  lastname: string
  email: string
  phone: string
}

export interface OrderDeliveriesItemVM {
  uuid: UUID
  method: string
  client: string
  trackingNumber: string
  weight: number
  status: DeliveryStatus
  followUrl?: string
  canMarkAsDelivered: boolean
}

export interface GetOrderVM {
  reference: string
  customer: OrderCustomerVM
  deliveryAddress: AddressVM
  orderStatus: OrderLineStatus
  deliveryStatus: DeliveryStatus
  deliveriesHeaders: Array<Header>
  deliveries: Array<OrderDeliveriesItemVM>
  trackingNumber?: string
  paymentStatus: PaymentStatus
  invoiceNumber?: string
  customerMessage?: string
}

const orderDeliveriesHeaders: Array<Header> = [
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
  },
  {
    name: 'Actions',
    value: 'actions'
  }
]

export const getOrderVM = (): GetOrderVM => {
  const orderStore = useOrderStore()
  const currentOrder: Order | undefined = orderStore.current
  if (!currentOrder) {
    return emptyVM()
  }
  const customer = getCustomerInformations(currentOrder)
  const deliveryStatus = getDeliveryStatus(currentOrder)
  const res: GetOrderVM = {
    reference: currentOrder.uuid,
    customer: {
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone
    },
    deliveryAddress: {
      name: `${customer.firstname} ${customer.lastname}`.trimStart(),
      address: currentOrder.deliveryAddress.address,
      city: currentOrder.deliveryAddress.city,
      zip: currentOrder.deliveryAddress.zip,
      country: currentOrder.deliveryAddress.country,
      phone: customer.phone
    },
    deliveriesHeaders: orderDeliveriesHeaders,
    deliveries: currentOrder.deliveries.map((delivery) => {
      const res: OrderDeliveriesItemVM = {
        uuid: delivery.uuid,
        method: delivery.method.name,
        client: `${delivery.receiver.address.firstname} ${delivery.receiver.address.lastname}`,
        trackingNumber: delivery.trackingNumber ?? '',
        weight: delivery.weight / 1000,
        status: delivery.status,
        canMarkAsDelivered:
          delivery.method.type === DeliveryType.ClickAndCollect
      }
      if (delivery.trackingNumber) {
        res.followUrl = `https://laposte.fr/outils/suivre-vos-envois?code=${delivery.trackingNumber}`
      }
      return res
    }),
    orderStatus: getOrderStatus(currentOrder),
    deliveryStatus,
    trackingNumber: currentOrder.deliveries[0].trackingNumber,
    paymentStatus:
      currentOrder.payment?.status ?? PaymentStatus.WaitingForPayment
  }
  if (currentOrder.invoiceNumber) {
    res.invoiceNumber = currentOrder.invoiceNumber
  }
  if (currentOrder.customerMessage) {
    res.customerMessage = currentOrder.customerMessage
  }
  return res
}

const getCustomerInformations = (order: Order): OrderCustomerVM => {
  if (isAnonymousOrder(order)) {
    return {
      firstname: order.deliveryAddress.firstname,
      lastname: order.deliveryAddress.lastname,
      email: order.contact.email,
      phone: order.contact.phone
    }
  }
  const customerStore = useCustomerStore()
  const customer = customerStore.getByUuid(order.customerUuid)
  return {
    firstname: customer?.firstname || '',
    lastname: customer?.lastname || '',
    email: customer?.email || '',
    phone: customer?.phone || ''
  }
}

const emptyVM = (): GetOrderVM => {
  return {
    customer: {
      firstname: '',
      lastname: '',
      email: '',
      phone: ''
    },
    deliveryAddress: {
      name: '',
      address: '',
      zip: '',
      city: '',
      phone: '',
      country: ''
    },
    reference: '',
    deliveriesHeaders: orderDeliveriesHeaders,
    deliveries: [],
    orderStatus: OrderLineStatus.Created,
    deliveryStatus: DeliveryStatus.Created,
    paymentStatus: PaymentStatus.WaitingForPayment
  }
}
