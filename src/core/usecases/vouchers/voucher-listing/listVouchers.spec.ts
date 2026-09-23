import { FakeUuidGenerator } from '@adapters/secondary/uuid-generators/FakeUuidGenerator'
import { InMemoryVoucherGateway } from '@adapters/secondary/voucher-gateways/InMemoryVoucherGateway'
import { VoucherPagination, VoucherStatus } from '@core/entities/voucher'
import { listVouchers } from '@core/usecases/vouchers/voucher-listing/listVouchers'
import { useVoucherStore } from '@store/voucherStore'
import {
  expiredVoucher,
  unusedVoucher,
  usedVoucher,
  voucherWithoutExpirationDate
} from '@utils/testData/vouchers'
import { createPinia, setActivePinia } from 'pinia'

describe('Vouchers listing', () => {
  let voucherStore: ReturnType<typeof useVoucherStore>
  let voucherGateway: InMemoryVoucherGateway
  const unusedVouchers = [
    unusedVoucher,
    voucherWithoutExpirationDate,
    expiredVoucher
  ]
  const pageSize = unusedVouchers.length - 1
  const firstPage: VoucherPagination = { limit: pageSize, offset: 0 }
  const secondPage: VoucherPagination = { limit: pageSize, offset: pageSize }

  beforeEach(() => {
    setActivePinia(createPinia())
    voucherGateway = new InMemoryVoucherGateway(new FakeUuidGenerator())
    voucherGateway.feedWith(...unusedVouchers, usedVoucher)
    voucherStore = useVoucherStore()
  })

  describe('Given the first page of unused vouchers is requested', () => {
    beforeEach(async () => {
      await listVouchers(VoucherStatus.Unused, firstPage, voucherGateway)
    })

    it('should list the first unused vouchers', () => {
      expect(voucherStore.items).toStrictEqual({
        [VoucherStatus.Unused]: unusedVouchers.slice(0, pageSize),
        [VoucherStatus.Used]: []
      })
    })

    it('should be aware that there is more unused vouchers', () => {
      expect(voucherStore.hasMore).toStrictEqual({
        [VoucherStatus.Unused]: true,
        [VoucherStatus.Used]: false
      })
    })
  })

  describe('Given the next page of unused vouchers is requested', () => {
    beforeEach(async () => {
      await listVouchers(VoucherStatus.Unused, firstPage, voucherGateway)
      await listVouchers(VoucherStatus.Unused, secondPage, voucherGateway)
    })

    it('should append the next unused vouchers', () => {
      expect(voucherStore.items[VoucherStatus.Unused]).toStrictEqual(
        unusedVouchers
      )
    })

    it('should be aware that there is no more unused vouchers', () => {
      expect(voucherStore.hasMore[VoucherStatus.Unused]).toBe(false)
    })
  })

  describe('Given the first page is requested again', () => {
    it('should replace the previously listed vouchers', async () => {
      await listVouchers(VoucherStatus.Unused, secondPage, voucherGateway)
      await listVouchers(VoucherStatus.Unused, firstPage, voucherGateway)
      expect(voucherStore.items[VoucherStatus.Unused]).toStrictEqual(
        unusedVouchers.slice(0, pageSize)
      )
    })
  })

  describe('Given the used vouchers are requested', () => {
    it('should only list the used vouchers', async () => {
      await listVouchers(VoucherStatus.Used, firstPage, voucherGateway)
      expect(voucherStore.items).toStrictEqual({
        [VoucherStatus.Unused]: [],
        [VoucherStatus.Used]: [usedVoucher]
      })
    })
  })

  describe('Loading', () => {
    it('should be aware during loading', async () => {
      const unsubscribe = voucherStore.$subscribe((_mutation, state) => {
        expect(state.isLoading).toBe(true)
        unsubscribe()
      })
      await listVouchers(VoucherStatus.Unused, firstPage, voucherGateway)
    })

    it('should be aware that loading is over', async () => {
      await listVouchers(VoucherStatus.Unused, firstPage, voucherGateway)
      expect(voucherStore.isLoading).toBe(false)
    })
  })
})
