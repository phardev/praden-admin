import {
  AssistanceRequestCategory,
  type AssistanceSubject,
  AssistanceSubjectType
} from '@core/entities/assistanceRequest'
import { useCustomerStore } from '@store/customerStore'
import { useOrderStore } from '@store/orderStore'
import { useProductStore } from '@store/productStore'

export interface PageSubject {
  subject: AssistanceSubject
  category: AssistanceRequestCategory
}

const orderPathPattern = /^\/orders\/([^/]+)$/
const productPathPattern = /^\/products\/(?:get|edit)\/([^/]+)$/
const customerPathPattern = /^\/customers\/(?:get|edit)\/([^/]+)$/

const uuidFromPath = (path: string, pattern: RegExp): string | undefined => {
  const match = path.match(pattern)
  return match ? match[1] : undefined
}

const orderPageSubject = (path: string): PageSubject | undefined => {
  const uuid = uuidFromPath(path, orderPathPattern)
  const order = useOrderStore().current
  if (!uuid || uuid === 'new' || order?.uuid !== uuid) return undefined
  return {
    subject: {
      type: AssistanceSubjectType.ORDER,
      label: `${order.deliveryAddress.firstname} ${order.deliveryAddress.lastname}`,
      uuid,
      pageUrl: `/orders/${uuid}`
    },
    category: AssistanceRequestCategory.ORDER
  }
}

const productPageSubject = (path: string): PageSubject | undefined => {
  const uuid = uuidFromPath(path, productPathPattern)
  const product = useProductStore().current?.product
  if (!uuid || product?.uuid !== uuid) return undefined
  return {
    subject: {
      type: AssistanceSubjectType.PRODUCT,
      label: product.name,
      uuid,
      pageUrl: `/products/get/${uuid}`
    },
    category: AssistanceRequestCategory.PRODUCT
  }
}

const customerPageSubject = (path: string): PageSubject | undefined => {
  const uuid = uuidFromPath(path, customerPathPattern)
  const customer = useCustomerStore().current
  if (!uuid || customer?.uuid !== uuid) return undefined
  return {
    subject: {
      type: AssistanceSubjectType.CUSTOMER,
      label: `${customer.firstname} ${customer.lastname}`,
      uuid,
      pageUrl: `/customers/get/${uuid}`
    },
    category: AssistanceRequestCategory.CUSTOMER
  }
}

export const pageSubjectFor = (routePath: string): PageSubject | undefined =>
  orderPageSubject(routePath) ??
  productPageSubject(routePath) ??
  customerPageSubject(routePath)
