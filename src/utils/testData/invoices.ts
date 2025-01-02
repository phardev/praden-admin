import {
  elodieDurandOrder1,
  elodieDurandOrder2,
  lucasLefevreOrder1,
  lucasLefevreOrder2,
  orderDelivered1,
  orderDelivered2,
  orderPartiallyShipped1,
  orderToCancel,
  orderVFASF,
  orderWithCustomerMessage,
  orderWithMissingProduct1,
  orderWithMissingProduct2,
  orderWithProductWithoutLocation,
  orderXUKIJ
} from '@utils/testData/orders'
import { Invoice } from '@core/entities/invoice'

export const orderDelivered1Invoice: Invoice = {
  id: orderDelivered1.invoiceNumber,
  data: orderDelivered1,
  createdAt: 1674273599954
}

export const orderDelivered2Invoice: Invoice = {
  id: orderDelivered2.invoiceNumber,
  data: orderDelivered2,
  createdAt: 1674273599954
}

export const orderWithMissingProduct1Invoice: Invoice = {
  id: orderWithMissingProduct1.invoiceNumber,
  data: orderWithMissingProduct1,
  createdAt: 1674273599954
}

export const orderWithMissingProduct2Invoice: Invoice = {
  id: orderWithMissingProduct2.invoiceNumber,
  data: orderWithMissingProduct2,
  createdAt: 1674273599954
}

export const orderToCancelInvoice: Invoice = {
  id: orderToCancel.invoiceNumber,
  data: orderToCancel,
  createdAt: 1674273599954
}

export const orderPartiallyShipped1Invoice: Invoice = {
  id: orderPartiallyShipped1.invoiceNumber,
  data: orderPartiallyShipped1,
  createdAt: 1674273599954
}

export const orderVFASFInvoice: Invoice = {
  id: orderVFASF.invoiceNumber,
  data: orderVFASF,
  createdAt: 1674273599954
}

export const orderXUKIJInvoice: Invoice = {
  id: orderXUKIJ.invoiceNumber,
  data: orderXUKIJ,
  createdAt: 1674273599954
}

export const orderWithProductWithoutLocationInvoice: Invoice = {
  id: orderWithProductWithoutLocation.invoiceNumber,
  data: orderWithProductWithoutLocation,
  createdAt: 1674273599954
}

export const elodieDurandOrder1Invoice: Invoice = {
  id: elodieDurandOrder1.invoiceNumber,
  data: elodieDurandOrder1,
  createdAt: 1674273599954
}

export const elodieDurandOrder2Invoice: Invoice = {
  id: elodieDurandOrder2.invoiceNumber,
  data: elodieDurandOrder2,
  createdAt: 1674273599954
}

export const lucasLefevreOrder1Invoice: Invoice = {
  id: lucasLefevreOrder1.invoiceNumber,
  data: lucasLefevreOrder1,
  createdAt: 1674273599954
}

export const lucasLefevreOrder2Invoice: Invoice = {
  id: lucasLefevreOrder2.invoiceNumber,
  data: lucasLefevreOrder2,
  createdAt: 1674273599954
}

export const orderWithCustomerMessageInvoice: Invoice = {
  id: orderWithCustomerMessage.invoiceNumber,
  data: orderWithCustomerMessage,
  createdAt: 1674273599954
}
