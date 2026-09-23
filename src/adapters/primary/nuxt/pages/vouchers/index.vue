<template lang="pug">
.section
  .flex.items-center.justify-between.mb-4
    h1.text-title {{ $t('voucher.listTitle') }}
    nuxt-link(to="/vouchers/new")
      ft-button.button-solid.text-xl.px-6 {{ $t('voucher.createButton') }}
  vouchers-list(:vouchers-vm="vouchersVM" @load-more="loadMore")
</template>

<script lang="ts" setup>
import { useVoucherErrorToast } from '@adapters/primary/nuxt/composables/useVoucherErrorToast'
import { getVouchersVM } from '@adapters/primary/view-models/vouchers/get-vouchers-vm/getVouchersVM'
import { VoucherStatus } from '@core/entities/voucher'
import { listVouchers } from '@core/usecases/vouchers/voucher-listing/listVouchers'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { useVoucherGateway } from '../../../../../../gateways/voucherGateway'

definePageMeta({ layout: 'main' })

const limit = 50
const offsets: Record<VoucherStatus, number> = {
  [VoucherStatus.Unused]: 0,
  [VoucherStatus.Used]: 0
}
const { showVoucherError } = useVoucherErrorToast()

const vouchersVM = computed(() => {
  return getVouchersVM(useDateProvider())
})

const hasMore = (status: VoucherStatus): boolean => {
  return !!vouchersVM.value.tabs.find((tab) => tab.status === status)?.hasMore
}

const loadMore = async (status: VoucherStatus, state: StateHandler) => {
  try {
    await listVouchers(
      status,
      { limit, offset: offsets[status] },
      useVoucherGateway()
    )
    offsets[status] += limit
    if (hasMore(status)) {
      state.loaded()
    } else {
      state.complete()
    }
  } catch (error) {
    showVoucherError(error)
    state.error()
  }
}
</script>
