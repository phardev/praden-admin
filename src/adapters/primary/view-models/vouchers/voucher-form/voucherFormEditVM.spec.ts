import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { EditVoucherDTO } from '@core/usecases/vouchers/voucher-edition/editVoucher'
import { useVoucherStore } from '@store/voucherStore'
import {
  unusedVoucher,
  usedVoucher,
  voucherAttachedToPendingOrder,
  voucherFixturesNow,
  voucherWithoutExpirationDate
} from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'
import { VoucherFormEditVM, voucherFormEditVM } from './voucherFormEditVM'

describe('Voucher form edit VM', () => {
  const key = 'voucher-edit'
  const dateProvider = new FakeDateProvider()
  let vm: VoucherFormEditVM
  let voucherStore: ReturnType<typeof useVoucherStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    dateProvider.feedWith(voucherFixturesNow)
    voucherStore = useVoucherStore()
    voucherStore.setCurrent(unusedVoucher)
    vm = voucherFormEditVM(key, dateProvider)
  })

  const givenCurrentVoucherIs = (voucher: typeof unusedVoucher) => {
    voucherStore.setCurrent(voucher)
    vm = voucherFormEditVM(key, dateProvider)
  }

  it('should initialize the code from the current voucher', () => {
    expect(vm.get('code')).toStrictEqual({
      value: unusedVoucher.code,
      canEdit: true
    })
  })

  it('should initialize the amount in euros', () => {
    expect(vm.get('amount')).toStrictEqual({
      value: unusedVoucher.amount / 100,
      canEdit: true
    })
  })

  it('should display the validate button', () => {
    expect(vm.getDisplayValidate()).toBe(true)
  })

  it('should build a dto with the amount back in cents', () => {
    vm.set('amount', voucherWithoutExpirationDate.amount / 100)
    const expectedDTO: EditVoucherDTO = {
      code: unusedVoucher.code,
      amount: voucherWithoutExpirationDate.amount,
      customerUuid: unusedVoucher.customer.uuid,
      expirationDate: unusedVoucher.expirationDate
    }
    expect(vm.getEditDto()).toStrictEqual(expectedDTO)
  })

  it('should send a null expiration date when it has been cleared', () => {
    vm.set('expirationDate', undefined)
    const expectedDTO: EditVoucherDTO = {
      code: unusedVoucher.code,
      amount: unusedVoucher.amount,
      customerUuid: unusedVoucher.customer.uuid,
      expirationDate: null
    }
    expect(vm.getEditDto()).toStrictEqual(expectedDTO)
  })

  describe('Changeability', () => {
    it('should allow changing an unused voucher', () => {
      expect(vm.canBeChanged()).toBe(true)
    })

    it('should not allow changing a used voucher', () => {
      givenCurrentVoucherIs(usedVoucher)
      expect(vm.canBeChanged()).toBe(false)
    })

    it('should not allow changing a voucher attached to an order', () => {
      givenCurrentVoucherIs(voucherAttachedToPendingOrder)
      expect(vm.canBeChanged()).toBe(false)
    })
  })
})
