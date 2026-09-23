import { VoucherCustomer } from '@core/entities/voucher'

export const voucherCustomerLabel = (customer: VoucherCustomer): string => {
  const fullname = [customer.firstname, customer.lastname]
    .filter(Boolean)
    .join(' ')
  return fullname.length > 0 ? fullname : customer.email
}
