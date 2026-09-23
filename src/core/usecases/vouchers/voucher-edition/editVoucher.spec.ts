import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryVoucherGateway } from '@adapters/secondary/voucher-gateways/InMemoryVoucherGateway'
import { VoucherStatus } from '@core/entities/voucher'
import { VoucherCannotBeChangedError } from '@core/errors/VoucherCannotBeChangedError'
import { VoucherWithSameCodeAlreadyExistsError } from '@core/errors/VoucherWithSameCodeAlreadyExistsError'
import { editVoucher } from '@core/usecases/vouchers/voucher-edition/editVoucher'
import { useVoucherStore } from '@store/voucherStore'
import {
  unusedVoucher,
  usedVoucher,
  voucherAttachedToPendingOrder,
  voucherWithoutExpirationDate
} from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'

describe('Voucher edition', () => {
  let voucherStore: ReturnType<typeof useVoucherStore>
  let voucherGateway: InMemoryVoucherGateway
  const newAmount = unusedVoucher.amount + voucherWithoutExpirationDate.amount

  beforeEach(() => {
    setActivePinia(createPinia())
    voucherGateway = new InMemoryVoucherGateway(new FakeUuidGenerator())
    voucherGateway.feedWith(
      unusedVoucher,
      voucherWithoutExpirationDate,
      voucherAttachedToPendingOrder,
      usedVoucher
    )
    voucherStore = useVoucherStore()
    voucherStore.list(VoucherStatus.Unused, [
      unusedVoucher,
      voucherWithoutExpirationDate
    ])
    voucherStore.setCurrent(unusedVoucher)
  })

  it('should replace the edited voucher in the unused vouchers', async () => {
    await editVoucher(unusedVoucher.uuid, { amount: newAmount }, voucherGateway)
    expect(voucherStore.items[VoucherStatus.Unused]).toStrictEqual([
      { ...unusedVoucher, amount: newAmount },
      voucherWithoutExpirationDate
    ])
  })

  it('should replace the current voucher', async () => {
    await editVoucher(unusedVoucher.uuid, { amount: newAmount }, voucherGateway)
    expect(voucherStore.current).toStrictEqual({
      ...unusedVoucher,
      amount: newAmount
    })
  })

  it('should clear the expiration date when it is set to null', async () => {
    const { expirationDate: _removed, ...unusedVoucherWithoutExpiration } =
      unusedVoucher
    await editVoucher(
      unusedVoucher.uuid,
      { expirationDate: null },
      voucherGateway
    )
    expect(voucherStore.current).toStrictEqual(unusedVoucherWithoutExpiration)
  })

  it('should throw when the new code is already taken', async () => {
    await expect(
      editVoucher(
        unusedVoucher.uuid,
        { code: voucherWithoutExpirationDate.code },
        voucherGateway
      )
    ).rejects.toThrow(VoucherWithSameCodeAlreadyExistsError)
  })

  it('should throw when the voucher is attached to an order', async () => {
    await expect(
      editVoucher(
        voucherAttachedToPendingOrder.uuid,
        { amount: newAmount },
        voucherGateway
      )
    ).rejects.toThrow(VoucherCannotBeChangedError)
  })

  it('should be aware that saving is over', async () => {
    await editVoucher(unusedVoucher.uuid, { amount: newAmount }, voucherGateway)
    expect(voucherStore.isSaving).toBe(false)
  })

  it('should be aware that saving is over when the edition fails', async () => {
    await editVoucher(
      usedVoucher.uuid,
      { amount: newAmount },
      voucherGateway
    ).catch(() => undefined)
    expect(voucherStore.isSaving).toBe(false)
  })
})
