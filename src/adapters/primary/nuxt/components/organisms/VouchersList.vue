<template lang="pug">
tab-group.border-b.border-gray-200(as="div")
  tab-list.-mb-px.flex.space-x-4
    tab.w-full.rounded-md.border-neutral-light.py-2.pl-3.pr-10.text-base.outline-0.cursor-pointer(
      v-for="tab in vouchersVm.tabs"
      v-slot="{ selected }"
      :key="tab.status"
      as="div"
    )
      div.whitespace-nowrap.flex.py-4.px-1.border-b-2.font-medium.text-sm(
        :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover:border-neutral-light']"
      ) {{ $t(tab.labelKey) }}
  tab-panels
    tab-panel.mt-4(v-for="tab in vouchersVm.tabs" :key="tab.status")
      ft-table(
        :headers="translatedHeaders(tab.headers)"
        :items="tab.items"
        :is-loading="vouchersVm.isLoading"
        item-key="uuid"
        @clicked="clicked"
      )
        template(#expirationDate="{ item }")
          time.text-error(v-if="item.isExpired" :datetime="item.expirationDatetime") {{ item.expirationDate }}
          time(v-else :datetime="item.expirationDatetime") {{ item.expirationDate }}
        template(#usedAt="{ item }")
          time(:datetime="item.usedAtDatetime") {{ item.usedAt }}
        template(#infinite)
          InfiniteLoading(@infinite="loadMore(tab.status, $event)")
            template(#complete)
              div
</template>

<script lang="ts" setup>
import type { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import type { GetVouchersVM } from '@adapters/primary/view-models/vouchers/get-vouchers-vm/getVouchersVM'
import type { VoucherStatus } from '@core/entities/voucher'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import InfiniteLoading from 'v3-infinite-loading'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import 'v3-infinite-loading/lib/style.css'

defineProps<{
  vouchersVm: GetVouchersVM
}>()

const emit = defineEmits<{
  (e: 'load-more', status: VoucherStatus, state: StateHandler): void
}>()

const { t } = useI18n()

const translatedHeaders = (headers: Array<Header>): Array<Header> =>
  headers.map((header) => ({ ...header, name: t(header.name) }))

const loadMore = (status: VoucherStatus, state: StateHandler) => {
  emit('load-more', status, state)
}

const clicked = (uuid: string) => {
  const router = useRouter()
  router.push(`/vouchers/get/${uuid}`)
}
</script>
