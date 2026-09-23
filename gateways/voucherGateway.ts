import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryVoucherGateway } from '@adapters/secondary/voucher-gateways/InMemoryVoucherGateway'
import { RealVoucherGateway } from '@adapters/secondary/voucher-gateways/RealVoucherGateway'
import { isLocalEnv } from '@utils/env'
import * as customers from '@utils/testData/customers'
import {
  expiredVoucher,
  unusedVoucher,
  usedVoucher,
  voucherAttachedToPendingOrder,
  voucherWithoutExpirationDate
} from '@utils/testData/vouchers'

const uuidGenerator = new FakeUuidGenerator()
uuidGenerator.setNext('new-voucher')
const voucherGateway = new InMemoryVoucherGateway(uuidGenerator)
voucherGateway.feedWith(
  unusedVoucher,
  voucherWithoutExpirationDate,
  expiredVoucher,
  voucherAttachedToPendingOrder,
  usedVoucher
)
voucherGateway.feedCustomersWith(...Object.values(customers))

export const useVoucherGateway = () => {
  if (isLocalEnv()) {
    return voucherGateway
  }
  const { BACKEND_URL } = useRuntimeConfig().public
  return new RealVoucherGateway(BACKEND_URL)
}
