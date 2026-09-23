import { Voucher, VoucherCustomer } from '@core/entities/voucher'
import { elodieDurand, lucasLefevre } from './customers'

const ONE_DAY = 24 * 60 * 60 * 1000

export const voucherFixturesNow = Date.UTC(2026, 8, 15, 10)

const elodieDurandVoucherCustomer: VoucherCustomer = {
  uuid: elodieDurand.uuid,
  email: elodieDurand.email,
  firstname: elodieDurand.firstname,
  lastname: elodieDurand.lastname
}

const lucasLefevreVoucherCustomer: VoucherCustomer = {
  uuid: lucasLefevre.uuid,
  email: lucasLefevre.email,
  firstname: lucasLefevre.firstname,
  lastname: lucasLefevre.lastname
}

export const unusedVoucher: Voucher = {
  uuid: 'unused-voucher',
  code: 'BON-UNUSED',
  amount: 1000,
  customer: elodieDurandVoucherCustomer,
  expirationDate: voucherFixturesNow + 30 * ONE_DAY,
  isAttachedToOrder: false
}

export const voucherWithoutExpirationDate: Voucher = {
  uuid: 'voucher-without-expiration-date',
  code: 'BON-FOREVER',
  amount: 2000,
  customer: lucasLefevreVoucherCustomer,
  isAttachedToOrder: false
}

export const expiredVoucher: Voucher = {
  uuid: 'expired-voucher',
  code: 'BON-EXPIRED',
  amount: 500,
  customer: lucasLefevreVoucherCustomer,
  expirationDate: voucherFixturesNow - ONE_DAY,
  isAttachedToOrder: false
}

export const voucherAttachedToPendingOrder: Voucher = {
  uuid: 'voucher-attached-to-pending-order',
  code: 'BON-PENDING',
  amount: 800,
  customer: elodieDurandVoucherCustomer,
  expirationDate: voucherFixturesNow + 60 * ONE_DAY,
  isAttachedToOrder: true
}

export const usedVoucher: Voucher = {
  uuid: 'used-voucher',
  code: 'BON-USED',
  amount: 1500,
  customer: elodieDurandVoucherCustomer,
  expirationDate: voucherFixturesNow + 30 * ONE_DAY,
  usedAt: voucherFixturesNow - 10 * ONE_DAY,
  orderUuid: 'order-that-consumed-the-voucher',
  isAttachedToOrder: true
}
