import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryVoucherGateway } from '@adapters/secondary/voucher-gateways/InMemoryVoucherGateway'
import type { Address } from '@core/entities/order'
import { VoucherCannotBeAppliedError } from '@core/errors/VoucherCannotBeAppliedError'
import {
  ApplyVoucherDTO,
  applyVoucher
} from '@core/usecases/vouchers/voucher-application/applyVoucher'
import { useVoucherStore } from '@store/voucherStore'
import { elodieDurand, lucasLefevre } from '@utils/testData/customers'
import { express } from '@utils/testData/deliveryMethods'
import { dolodent } from '@utils/testData/products'
import {
  unusedVoucher,
  voucherWithoutExpirationDate
} from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'

describe('Voucher application to a manual order', () => {
  let voucherStore: ReturnType<typeof useVoucherStore>
  let voucherGateway: InMemoryVoucherGateway
  const deliveryAddress: Address = {
    firstname: elodieDurand.firstname,
    lastname: elodieDurand.lastname,
    address: '12 rue des Lilas',
    city: 'Alès',
    zip: '30100',
    country: 'France'
  }
  const dto: ApplyVoucherDTO = {
    code: unusedVoucher.code,
    customerUuid: elodieDurand.uuid,
    lines: [{ productUuid: dolodent.uuid, quantity: 1 }],
    deliveryAddress,
    deliveryMethodUuid: express.uuid
  }
  const anotherCustomerDto: ApplyVoucherDTO = {
    ...dto,
    code: voucherWithoutExpirationDate.code,
    customerUuid: elodieDurand.uuid
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    voucherGateway = new InMemoryVoucherGateway(new FakeUuidGenerator())
    voucherGateway.feedWith(unusedVoucher, voucherWithoutExpirationDate)
    voucherStore = useVoucherStore()
  })

  describe('Given a voucher of the customer', () => {
    it('should store the applied voucher with its discount', async () => {
      await applyVoucher(dto, voucherGateway)
      expect(voucherStore.appliedToManualOrder).toStrictEqual({
        request: dto,
        discount: unusedVoucher.amount
      })
    })

    it('should be aware that applying is over', async () => {
      await applyVoucher(dto, voucherGateway)
      expect(voucherStore.isApplying).toBe(false)
    })
  })

  describe('Given a voucher of another customer', () => {
    beforeEach(() => {
      voucherStore.applyToManualOrder({
        request: dto,
        discount: unusedVoucher.amount
      })
    })

    it('should refuse the voucher', async () => {
      await expect(
        applyVoucher(anotherCustomerDto, voucherGateway)
      ).rejects.toThrow(VoucherCannotBeAppliedError)
    })

    it('should forget the previously applied voucher', async () => {
      await applyVoucher(anotherCustomerDto, voucherGateway).catch(
        () => undefined
      )
      expect(voucherStore.appliedToManualOrder).toBeUndefined()
    })

    it('should be aware that applying is over', async () => {
      await applyVoucher(anotherCustomerDto, voucherGateway).catch(
        () => undefined
      )
      expect(voucherStore.isApplying).toBe(false)
    })
  })

  describe('Given the voucher of a customer is applied for another one', () => {
    it('should keep the reason of the refusal', async () => {
      const error = await applyVoucher(
        { ...dto, customerUuid: lucasLefevre.uuid },
        voucherGateway
      ).catch((e) => e)
      expect({ code: error.code, reason: error.reason }).toStrictEqual({
        code: 'VOUCHER_CANNOT_BE_APPLIED',
        reason: 'BELONGS_TO_ANOTHER_CUSTOMER'
      })
    })
  })
})
