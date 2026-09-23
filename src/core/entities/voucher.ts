import { Timestamp, UUID } from '@core/types/types'

export const VoucherStatus = {
  Unused: 'unused',
  Used: 'used'
} as const

export type VoucherStatus = (typeof VoucherStatus)[keyof typeof VoucherStatus]

export interface VoucherCustomer {
  uuid: UUID
  email: string
  firstname?: string
  lastname?: string
}

export interface Voucher {
  uuid: UUID
  code: string
  amount: number
  customer: VoucherCustomer
  expirationDate?: Timestamp
  usedAt?: Timestamp
  orderUuid?: UUID
  isAttachedToOrder: boolean
}

export interface CreateVoucherDTO {
  code?: string
  amount: number
  customerUuid: UUID
  expirationDate?: Timestamp
}

export interface VoucherPagination {
  limit: number
  offset: number
}

export const isVoucherUsed = (voucher: Voucher): boolean =>
  voucher.usedAt !== undefined

export const isVoucherExpired = (voucher: Voucher, now: Timestamp): boolean =>
  voucher.expirationDate !== undefined && now > voucher.expirationDate

export const isVoucherUsable = (voucher: Voucher, now: Timestamp): boolean =>
  !isVoucherUsed(voucher) && !isVoucherExpired(voucher, now)

export const canVoucherBeChanged = (voucher: Voucher): boolean =>
  !isVoucherUsed(voucher) && !voucher.isAttachedToOrder

export const statusOfVoucher = (voucher: Voucher): VoucherStatus =>
  isVoucherUsed(voucher) ? VoucherStatus.Used : VoucherStatus.Unused
