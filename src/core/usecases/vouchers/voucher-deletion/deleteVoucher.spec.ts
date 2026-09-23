import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryVoucherGateway } from '@adapters/secondary/voucher-gateways/InMemoryVoucherGateway'
import { VoucherStatus } from '@core/entities/voucher'
import { VoucherCannotBeChangedError } from '@core/errors/VoucherCannotBeChangedError'
import { VoucherDoesNotExistsError } from '@core/errors/VoucherDoesNotExistsError'
import { deleteVoucher } from '@core/usecases/vouchers/voucher-deletion/deleteVoucher'
import { useVoucherStore } from '@store/voucherStore'
import {
  unusedVoucher,
  usedVoucher,
  voucherWithoutExpirationDate
} from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'

describe('Voucher deletion', () => {
  let voucherStore: ReturnType<typeof useVoucherStore>
  let voucherGateway: InMemoryVoucherGateway

  beforeEach(() => {
    setActivePinia(createPinia())
    voucherGateway = new InMemoryVoucherGateway(new FakeUuidGenerator())
    voucherGateway.feedWith(
      unusedVoucher,
      voucherWithoutExpirationDate,
      usedVoucher
    )
    voucherStore = useVoucherStore()
    voucherStore.list(VoucherStatus.Unused, [
      unusedVoucher,
      voucherWithoutExpirationDate
    ])
  })

  it('should remove the voucher from the unused vouchers', async () => {
    await deleteVoucher(unusedVoucher.uuid, voucherGateway)
    expect(voucherStore.items[VoucherStatus.Unused]).toStrictEqual([
      voucherWithoutExpirationDate
    ])
  })

  it('should throw when the voucher does not exist', async () => {
    await expect(deleteVoucher('unknown', voucherGateway)).rejects.toThrow(
      VoucherDoesNotExistsError
    )
  })

  it('should throw when the voucher is already used', async () => {
    await expect(
      deleteVoucher(usedVoucher.uuid, voucherGateway)
    ).rejects.toThrow(VoucherCannotBeChangedError)
  })

  it('should be aware that saving is over', async () => {
    await deleteVoucher(unusedVoucher.uuid, voucherGateway)
    expect(voucherStore.isSaving).toBe(false)
  })

  it('should be aware that saving is over when the deletion fails', async () => {
    await deleteVoucher('unknown', voucherGateway).catch(() => undefined)
    expect(voucherStore.isSaving).toBe(false)
  })
})
