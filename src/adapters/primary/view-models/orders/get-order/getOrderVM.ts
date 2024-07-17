import { useOrderStore } from '@store/orderStore'
import {
  DeliveryStatus,
  getDeliveryStatus,
  isAnonymousOrder,
  Order,
  PaymentStatus
} from '@core/entities/order'
import { AddressVM } from '@adapters/primary/view-models/invoices/get-invoice/getInvoiceVM'
import { useCustomerStore } from '@store/customerStore'

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
  deliveryStatus: DeliveryStatus
  paymentStatus: PaymentStatus
}

export const getOrderVM = (): GetOrderVM => {
  const orderStore = useOrderStore()
  const currentOrder: Order | undefined = orderStore.current
  if (!currentOrder) {
    return emptyVM()
  }
  const customer = getCustomerInformations(currentOrder)
  return {
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
      phone: customer.phone
    },
    deliveryStatus: getDeliveryStatus(currentOrder),
    paymentStatus: currentOrder.payment.status
  }
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
      phone: ''
    },
    reference: '',
    deliveryStatus: DeliveryStatus.Created,
    paymentStatus: PaymentStatus.WaitingForPayment
  }
}
