import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryVoucherGateway } from '@adapters/secondary/voucher-gateways/InMemoryVoucherGateway'
import { VoucherDoesNotExistsError } from '@core/errors/VoucherDoesNotExistsError'
import { getVoucher } from '@core/usecases/vouchers/get-voucher/getVoucher'
import { useVoucherStore } from '@store/voucherStore'
import { unusedVoucher, usedVoucher } from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'

describe('Get voucher', () => {
  let voucherStore: ReturnType<typeof useVoucherStore>
  let voucherGateway: InMemoryVoucherGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    voucherGateway = new InMemoryVoucherGateway(new FakeUuidGenerator())
    voucherGateway.feedWith(unusedVoucher, usedVoucher)
    voucherStore = useVoucherStore()
  })

  it('should set the wanted voucher as current', async () => {
    await getVoucher(usedVoucher.uuid, voucherGateway)
    expect(voucherStore.current).toStrictEqual(usedVoucher)
  })

  it('should throw when the voucher does not exist', async () => {
    await expect(getVoucher('unknown', voucherGateway)).rejects.toThrow(
      VoucherDoesNotExistsError
    )
  })

  it('should be aware that loading is over', async () => {
    await getVoucher(unusedVoucher.uuid, voucherGateway)
    expect(voucherStore.isLoading).toBe(false)
  })

  it('should be aware that loading is over when the voucher does not exist', async () => {
    await getVoucher('unknown', voucherGateway).catch(() => undefined)
    expect(voucherStore.isLoading).toBe(false)
  })
})
