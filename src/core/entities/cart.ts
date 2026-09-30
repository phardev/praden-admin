import type { Address, Contact } from '@core/entities/order'
import { ReductionType } from '@core/entities/promotion'
import { Timestamp, UUID } from '@core/types/types'

export enum CartLineAlert {
  ProductUnavailable = 'PRODUCT_UNAVAILABLE',
  OutOfStock = 'OUT_OF_STOCK',
  NotEnoughStock = 'NOT_ENOUGH_STOCK',
  ExceedsMaxQuantityForOrder = 'EXCEEDS_MAX_QUANTITY_FOR_ORDER',
  ExceedsMedicineLimit = 'EXCEEDS_MEDICINE_LIMIT'
}

export enum CartMissingInformation {
  Lines = 'LINES',
  DeliveryMethod = 'DELIVERY_METHOD',
  PickupPoint = 'PICKUP_POINT',
  PickingDate = 'PICKING_DATE',
  Contact = 'CONTACT',
  Addresses = 'ADDRESSES',
  BlockingAlerts = 'BLOCKING_ALERTS'
}

export enum CartCodeStatus {
  Applied = 'APPLIED',
  Rejected = 'REJECTED'
}

export enum CartEventType {
  ProductAdded = 'PRODUCT_ADDED',
  QuantityChanged = 'QUANTITY_CHANGED',
  ProductRemoved = 'PRODUCT_REMOVED',
  CartEmptied = 'CART_EMPTIED',
  DeliveryChosen = 'DELIVERY_CHOSEN',
  ContactAndAddressesProvided = 'CONTACT_AND_ADDRESSES_PROVIDED',
  PromotionCodeApplied = 'PROMOTION_CODE_APPLIED',
  PromotionCodeRemoved = 'PROMOTION_CODE_REMOVED',
  VoucherApplied = 'VOUCHER_APPLIED',
  VoucherRemoved = 'VOUCHER_REMOVED',
  GuestCartMerged = 'GUEST_CART_MERGED',
  OrderPlaced = 'ORDER_PLACED',
  CartClosed = 'CART_CLOSED',
  ReminderSent = 'REMINDER_SENT'
}

export interface CartLinePromotion {
  uuid: UUID
  type: ReductionType
  amount: number
}

export interface CartLine {
  productUuid: UUID
  name: string
  ean13: string
  laboratory?: string
  miniature?: { url: string }
  noticeUrl?: string
  isMedicine: boolean
  quantity: number
  maxQuantity: number
  unitPriceWithTax: number
  unitPriceWithTaxBeforePromotion: number
  promotion?: CartLinePromotion
  totalWithTax: number
  alerts: Array<CartLineAlert>
}

export interface CartTotals {
  productsWithTax: number
  deliveryWithTax: number | null
  promotionCodeDiscount: number
  voucherDiscount: number
  total: number
}

export interface CartCodeRejection {
  reason: string
  minimumAmount?: number
  missingAmount?: number
  maxWeight?: number
}

export interface CartCode {
  code: string
  status: CartCodeStatus
  discount: number
  rejection?: CartCodeRejection
}

export interface CartDelivery {
  methodUuid: UUID
  pickupId?: string
  pickupName?: string
  pickingDate?: Timestamp
}

export interface CartActivity {
  type: CartEventType
  data: Record<string, unknown>
  createdAt: Timestamp
  createdBy: string
}

export interface Cart {
  uuid?: UUID
  customerUuid?: UUID
  lines: Array<CartLine>
  totalQuantity: number
  containsMedicine: boolean
  delivery?: CartDelivery
  contact?: Contact
  deliveryAddress?: Address
  billingAddress?: Address
  customerMessage?: string
  promotionCode?: CartCode
  voucher?: CartCode
  totals: CartTotals
  missingForOrder: Array<CartMissingInformation>
  orderUuid?: UUID
  updatedAt: Timestamp
  activity: Array<CartActivity>
}

export enum CartListStatus {
  Open = 'OPEN',
  Abandoned = 'ABANDONED',
  Closed = 'CLOSED'
}

export interface CartListCustomer {
  uuid: UUID
  firstname?: string
  lastname?: string
  email: string
}

export interface CartListItem {
  uuid: UUID
  customer?: CartListCustomer
  totalWithTax?: number
  totalQuantity: number
  lastActivityAt: Timestamp
  status: CartListStatus
  orderUuid?: UUID
  lastRejectedCode?: string
  evaluatedAt?: Timestamp
}

export interface CartListPagination {
  limit: number
  offset: number
}

export enum CartListTab {
  All = 'ALL',
  Open = 'OPEN',
  Abandoned = 'ABANDONED',
  Closed = 'CLOSED'
}

const STATUS_OF_TAB: Record<CartListTab, CartListStatus | undefined> = {
  [CartListTab.All]: undefined,
  [CartListTab.Open]: CartListStatus.Open,
  [CartListTab.Abandoned]: CartListStatus.Abandoned,
  [CartListTab.Closed]: CartListStatus.Closed
}

export const statusOfTab = (tab: CartListTab): CartListStatus | undefined =>
  STATUS_OF_TAB[tab]

export enum CustomerCartAction {
  ApplyPromotionCode = 'APPLY_PROMOTION_CODE',
  RemovePromotionCode = 'REMOVE_PROMOTION_CODE',
  ApplyVoucher = 'APPLY_VOUCHER',
  RemoveVoucher = 'REMOVE_VOUCHER'
}
