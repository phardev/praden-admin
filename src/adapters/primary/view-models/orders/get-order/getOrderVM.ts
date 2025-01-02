import { useOrderStore } from '@store/orderStore'
import {
  getDeliveryStatus,
  getOrderStatus,
  isAnonymousOrder,
  Order,
  OrderLineStatus,
  PaymentStatus
} from '@core/entities/order'
import { AddressVM } from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'
import { useCustomerStore } from '@store/customerStore'
import { Delivery, DeliveryStatus } from '@core/entities/delivery'

export interface OrderCustomerVM {
  firstname: string
  lastname: string
  email: string
  phone: string
}

export interface GetOrderVM {
  reference: string
  customer: OrderCustomerVM
  deliveryAddress: AddressVM
  orderStatus: OrderLineStatus
  deliveryStatus: DeliveryStatus
  deliveries: Array<Delivery>
  trackingNumber?: string
  paymentStatus: PaymentStatus
  invoiceNumber?: string
  customerMessage?: string
}

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
    deliveries: currentOrder.deliveries,
    orderStatus: getOrderStatus(currentOrder),
    deliveryStatus,
    trackingNumber: currentOrder.deliveries[0].trackingNumber,
    paymentStatus: currentOrder.payment.status
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
    deliveries: [],
    orderStatus: OrderLineStatus.Created,
    deliveryStatus: DeliveryStatus.Created,
    paymentStatus: PaymentStatus.WaitingForPayment
  }
}
