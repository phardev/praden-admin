<template lang="pug">
tab-group.border-b.border-gray-200(as="div")
  tab-list.-mb-px.flex.space-x-4
    tab.w-full.rounded-md.border-neutral-light.py-2.pl-3.pr-10.text-base.outline-0.cursor-pointer(
      v-for="tab in cartsVm.tabs"
      v-slot="{ selected }"
      :key="tab.tab"
      as="div"
    )
      div.whitespace-nowrap.flex.py-4.px-1.border-b-2.font-medium.text-sm(
        :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover:border-neutral-light']"
      ) {{ $t(tab.labelKey) }}
  tab-panels
    tab-panel.mt-4(v-for="tab in cartsVm.tabs" :key="tab.tab")
      ft-table(
        :headers="translatedHeaders(tab.headers)"
        :items="tab.items"
        :is-loading="cartsVm.isLoading"
        item-key="uuid"
        @clicked="clicked(tab.items, $event)"
      )
        template(#customer="{ item }")
          span.text-gray-500(v-if="item.isGuest") {{ $t('carts.guest') }}
          span(v-else) {{ item.customer }}
        template(#status="{ item }")
          span {{ $t(item.statusKey) }}
        template(#rejectedCode="{ item }")
          UBadge(v-if="item.rejectedCode" color="red" variant="soft") {{ item.rejectedCode }}
        template(#infinite)
          InfiniteLoading(@infinite="loadMore(tab.tab, $event)")
            template(#complete)
              div
</template>

<script lang="ts" setup>
import type {
  CartListItemVM,
  GetCartsListVM
} from '@adapters/primary/view-models/carts/get-carts-list/getCartsListVM'
import type { Header } from '@adapters/primary/view-models/preparations/get-orders-to-prepare/getPreparationsVM'
import type { CartListTab } from '@core/entities/cart'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import InfiniteLoading from 'v3-infinite-loading'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import 'v3-infinite-loading/lib/style.css'

defineProps<{
  cartsVm: GetCartsListVM
}>()

const emit = defineEmits<{
  (e: 'load-more', tab: CartListTab, state: StateHandler): void
}>()

const { t } = useI18n()
const router = useRouter()

const translatedHeaders = (headers: Array<Header>): Array<Header> =>
  headers.map((header) => ({ ...header, name: t(header.name) }))

const loadMore = (tab: CartListTab, state: StateHandler) => {
  emit('load-more', tab, state)
}

const clicked = (items: Array<CartListItemVM>, uuid: string) => {
  const link = items.find((item) => item.uuid === uuid)?.link
  if (link) {
    router.push(link)
  }
}
</script>
