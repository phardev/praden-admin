import { removeAppliedVoucher } from '@core/usecases/vouchers/voucher-removal/removeAppliedVoucher'
import { useVoucherStore } from '@store/voucherStore'
import { elodieDurand } from '@utils/testData/customers'
import { express } from '@utils/testData/deliveryMethods'
import { unusedVoucher } from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'

describe('Applied voucher removal', () => {
  let voucherStore: ReturnType<typeof useVoucherStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    voucherStore = useVoucherStore()
    voucherStore.applyToManualOrder({
      request: {
        code: unusedVoucher.code,
        customerUuid: elodieDurand.uuid,
        lines: [],
        deliveryAddress: {
          firstname: '',
          lastname: '',
          address: '',
          city: '',
          zip: '',
          country: ''
        },
        deliveryMethodUuid: express.uuid
      },
      discount: unusedVoucher.amount
    })
  })

  it('should forget the applied voucher', () => {
    removeAppliedVoucher()
    expect(voucherStore.appliedToManualOrder).toBeUndefined()
  })
})
