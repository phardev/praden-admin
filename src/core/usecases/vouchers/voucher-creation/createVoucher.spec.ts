import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryVoucherGateway } from '@adapters/secondary/voucher-gateways/InMemoryVoucherGateway'
import { CreateVoucherDTO, VoucherStatus } from '@core/entities/voucher'
import { VoucherWithSameCodeAlreadyExistsError } from '@core/errors/VoucherWithSameCodeAlreadyExistsError'
import { createVoucher } from '@core/usecases/vouchers/voucher-creation/createVoucher'
import { useVoucherStore } from '@store/voucherStore'
import { elodieDurand } from '@utils/testData/customers'
import { unusedVoucher } from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'

describe('Voucher creation', () => {
  let voucherStore: ReturnType<typeof useVoucherStore>
  let voucherGateway: InMemoryVoucherGateway
  let uuidGenerator: FakeUuidGenerator
  let dto: CreateVoucherDTO

  beforeEach(() => {
    setActivePinia(createPinia())
    uuidGenerator = new FakeUuidGenerator()
    uuidGenerator.setNext('new-voucher')
    voucherGateway = new InMemoryVoucherGateway(uuidGenerator)
    voucherGateway.feedCustomersWith(elodieDurand)
    voucherStore = useVoucherStore()
    dto = {
      code: 'BON-CHOSEN',
      amount: unusedVoucher.amount,
      customerUuid: elodieDurand.uuid,
      expirationDate: unusedVoucher.expirationDate
    }
  })

  it('should add the created voucher first in the unused vouchers', async () => {
    voucherStore.list(VoucherStatus.Unused, [unusedVoucher])
    await createVoucher(dto, voucherGateway)
    expect(voucherStore.items[VoucherStatus.Unused]).toStrictEqual([
      {
        uuid: 'new-voucher',
        code: dto.code,
        amount: dto.amount,
        customer: {
          uuid: elodieDurand.uuid,
          email: elodieDurand.email,
          firstname: elodieDurand.firstname,
          lastname: elodieDurand.lastname
        },
        expirationDate: dto.expirationDate,
        isAttachedToOrder: false
      },
      unusedVoucher
    ])
  })

  it('should throw when a voucher with the same code already exists', async () => {
    voucherGateway.feedWith(unusedVoucher)
    dto.code = unusedVoucher.code
    await expect(createVoucher(dto, voucherGateway)).rejects.toThrow(
      VoucherWithSameCodeAlreadyExistsError
    )
  })

  it('should be aware that saving is over', async () => {
    await createVoucher(dto, voucherGateway)
    expect(voucherStore.isSaving).toBe(false)
  })

  it('should be aware that saving is over when the creation fails', async () => {
    voucherGateway.feedWith(unusedVoucher)
    dto.code = unusedVoucher.code
    await createVoucher(dto, voucherGateway).catch(() => undefined)
    expect(voucherStore.isSaving).toBe(false)
  })
})
