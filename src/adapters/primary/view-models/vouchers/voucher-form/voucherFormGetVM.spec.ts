import { FakeDateProvider } from '@adapters/secondary/date-providers/FakeDateProvider'
import { Voucher } from '@core/entities/voucher'
import { useVoucherStore } from '@store/voucherStore'
import { timestampToLocaleString } from '@utils/formatters'
import {
  expiredVoucher,
  usedVoucher,
  voucherAttachedToPendingOrder,
  voucherFixturesNow,
  voucherWithoutExpirationDate
} from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'
import { VoucherFormGetVM, voucherFormGetVM } from './voucherFormGetVM'

describe('Voucher form get VM', () => {
  const key = 'voucher-get'
  const dateProvider = new FakeDateProvider()
  let vm: VoucherFormGetVM
  let voucherStore: ReturnType<typeof useVoucherStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    dateProvider.feedWith(voucherFixturesNow)
    voucherStore = useVoucherStore()
  })

  const givenCurrentVoucherIs = (voucher: Voucher) => {
    voucherStore.setCurrent(voucher)
    vm = voucherFormGetVM(key, dateProvider)
  }

  describe('An unused voucher', () => {
    beforeEach(() => {
      givenCurrentVoucherIs(voucherWithoutExpirationDate)
    })

    it('should display the code without allowing to edit it', () => {
      expect(vm.get('code')).toStrictEqual({
        value: voucherWithoutExpirationDate.code,
        canEdit: false
      })
    })

    it('should convert the amount back to euros', () => {
      expect(vm.get('amount')).toStrictEqual({
        value: voucherWithoutExpirationDate.amount / 100,
        canEdit: false
      })
    })

    it('should not display the validate button', () => {
      expect(vm.getDisplayValidate()).toBe(false)
    })

    it('should label the customer with its fullname', () => {
      const { firstname, lastname } = voucherWithoutExpirationDate.customer
      expect(vm.getCustomerLabel()).toStrictEqual(`${firstname} ${lastname}`)
    })

    it('should display the unused status', () => {
      expect(vm.getStatus()).toStrictEqual({ key: 'voucher.status.unused' })
    })

    it('should allow changing it', () => {
      expect(vm.canBeChanged()).toBe(true)
    })
  })

  describe('A used voucher', () => {
    beforeEach(() => {
      givenCurrentVoucherIs(usedVoucher)
    })

    it('should display the used status with its date', () => {
      expect(vm.getStatus()).toStrictEqual({
        key: 'voucher.status.used',
        params: { date: timestampToLocaleString(usedVoucher.usedAt!, 'fr-FR') }
      })
    })

    it('should expose the consuming order', () => {
      expect(vm.getOrderUuid()).toStrictEqual(usedVoucher.orderUuid)
    })

    it('should not allow changing it', () => {
      expect(vm.canBeChanged()).toBe(false)
    })
  })

  describe('A voucher attached to an order', () => {
    it('should not allow changing it', () => {
      givenCurrentVoucherIs(voucherAttachedToPendingOrder)
      expect(vm.canBeChanged()).toBe(false)
    })
  })

  describe('An expired voucher', () => {
    it('should display the expired status with its date', () => {
      givenCurrentVoucherIs(expiredVoucher)
      expect(vm.getStatus()).toStrictEqual({
        key: 'voucher.status.expired',
        params: {
          date: timestampToLocaleString(expiredVoucher.expirationDate!, 'fr-FR')
        }
      })
    })
  })
})
