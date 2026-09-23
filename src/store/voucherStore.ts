import { statusOfVoucher, Voucher, VoucherStatus } from '@core/entities/voucher'
import { UUID } from '@core/types/types'
import { ApplyVoucherDTO } from '@core/usecases/vouchers/voucher-application/applyVoucher'
import { defineStore } from 'pinia'

export interface AppliedVoucher {
  request: ApplyVoucherDTO
  discount: number
}

const emptyVouchersByStatus = (): Record<VoucherStatus, Array<Voucher>> => ({
  [VoucherStatus.Unused]: [],
  [VoucherStatus.Used]: []
})

const copyOf = (voucher: Voucher): Voucher =>
  JSON.parse(JSON.stringify(voucher))

export const useVoucherStore = defineStore('VoucherStore', {
  state: () => {
    return {
      items: emptyVouchersByStatus(),
      hasMore: {
        [VoucherStatus.Unused]: false,
        [VoucherStatus.Used]: false
      } as Record<VoucherStatus, boolean>,
      current: undefined as Voucher | undefined,
      suggestedCode: undefined as string | undefined,
      isLoading: false,
      isSaving: false,
      appliedToManualOrder: undefined as AppliedVoucher | undefined,
      isApplying: false
    }
  },
  actions: {
    list(status: VoucherStatus, vouchers: Array<Voucher>) {
      this.items[status] = vouchers
    },
    append(status: VoucherStatus, vouchers: Array<Voucher>) {
      this.items[status] = [...this.items[status], ...vouchers]
    },
    setHasMore(status: VoucherStatus, hasMore: boolean) {
      this.hasMore[status] = hasMore
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    },
    startSaving() {
      this.isSaving = true
    },
    stopSaving() {
      this.isSaving = false
    },
    setCurrent(voucher: Voucher) {
      this.current = copyOf(voucher)
    },
    create(voucher: Voucher) {
      const status = statusOfVoucher(voucher)
      this.items[status] = [voucher, ...this.items[status]]
    },
    edit(voucher: Voucher) {
      this.items[VoucherStatus.Unused] = this.items[VoucherStatus.Unused].map(
        (v) => (v.uuid === voucher.uuid ? voucher : v)
      )
      if (this.current?.uuid === voucher.uuid) {
        this.current = copyOf(voucher)
      }
    },
    delete(uuid: UUID) {
      this.items[VoucherStatus.Unused] = this.items[
        VoucherStatus.Unused
      ].filter((v) => v.uuid !== uuid)
      if (this.current?.uuid === uuid) {
        this.current = undefined
      }
    },
    setSuggestedCode(code: string) {
      this.suggestedCode = code
    },
    startApplying() {
      this.isApplying = true
    },
    stopApplying() {
      this.isApplying = false
    },
    applyToManualOrder(appliedVoucher: AppliedVoucher) {
      this.appliedToManualOrder = appliedVoucher
    },
    removeFromManualOrder() {
      this.appliedToManualOrder = undefined
    }
  }
})
