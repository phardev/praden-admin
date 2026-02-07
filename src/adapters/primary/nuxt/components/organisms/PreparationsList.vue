<template lang="pug">
div
  .flex.flex-col.items-center
    .flex.flex-row.items-center.justify-between.w-full.mb-2
      .text-3xl.font-extrabold.text-gray-900.tracking-tight {{ $t('preparations.title') }}
      ft-button(icon='i-heroicons-arrow-path' size="md" :loading='preparationsVm.isLoading' @click='fetchOrdersToPrepare')
        | {{ $t('preparations.refresh') }}
    .relative.flex.items-center.justify-center.my-2
      .absolute.inset-0.flex.items-center.justify-center.pointer-events-none
      preparations-gauge.z-10(
        :percentage="gaugeVm.percentage"
        :status="gaugeVm.status"
        :good-count="gaugeVm.goodCount"
        :warning-count="gaugeVm.warningCount"
        :alert-count="gaugeVm.alertCount"
      )
    .flex.items-center.justify-center.gap-4.mt-6.flex-wrap
      div.px-5.py-2.rounded-full.bg-gradient-to-r.from-red-500.to-red-400.text-white.flex.items-center.gap-2.shadow-md.border(class="border-red-300/50 transition-transform hover:scale-105 cursor-pointer")
        icon(name="streamline:smiley-emoji-terrified" class="text-white animate-wiggle-on-hover" style="width: 1.3em; height: 1.3em;")
        span.font-medium {{ $t('preparations.gauge.alert') }}
        span.font-bold {{ gaugeVm.alertCount }}
      div.px-5.py-2.rounded-full.bg-gradient-to-r.from-yellow-400.to-yellow-300.text-white.flex.items-center.gap-2.shadow-md.border(class="border-yellow-200/50 transition-transform hover:scale-105 cursor-pointer")
        icon(name="streamline:mail-smiley-straight-face-chat-message-indifferent-smiley-emoji-face-poker" class="text-white animate-wiggle-on-hover" style="width: 1.3em; height: 1.3em;")
        span.font-medium {{ $t('preparations.gauge.warning') }}
        span.font-bold {{ gaugeVm.warningCount }}
      div.px-5.py-2.rounded-full.bg-gradient-to-r.from-green-500.to-green-400.text-white.flex.items-center.gap-2.shadow-md.border(class="border-green-200/50 transition-transform hover:scale-105 cursor-pointer")
        icon(name="streamline:mail-smiley-happy-face-chat-message-smiley-smile-emoji-face-satisfied" class="text-white animate-wiggle-on-hover" style="width: 1.3em; height: 1.3em;")
        span.font-medium {{ $t('preparations.gauge.good') }}
        span.font-bold {{ gaugeVm.goodCount }}

tab-group.border-b.border-gray-200.mt-4(as="div")
  tab-list.-mb-px.flex.space-x-4
    tab.w-full.rounded-md.border-neutral-light.py-2.pl-3.pr-10.text-base.outline-0.cursor-pointer(
      v-for="(group, tabIndex) in Object.keys(preparationsVm.items)"
      v-slot="{ selected }"
      :key="tabIndex"
      as="div"
      @click="resetSelection"
    )
      div.whitespace-nowrap.flex.py-4.px-1.border-b-2.font-medium.text-sm(
        :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover:border-neutral-light']"
      )
        div {{ group }}
          span.hidden.ml-3.rounded-full.text-xs.font-medium(
            v-if="preparationsVm.items[group].count"
            :class="[selected ? 'bg-contrast text-colored' : 'bg-light text-contrast', 'py-0.5 px-2.5 md:inline-block']"
          ) {{ preparationsVm.items[group].count }}
  tab-panels(v-for="(group, index) in Object.values(preparationsVm.items)" :key="index")
    tab-panel.mt-4
      ft-table(
        :headers="group.table.headers"
        :items="group.table.items"
        :selectable="group.canSelect"
        :selection="ordersSelectedVM.items"
        :is-loading="preparationsVm.isLoading"
        item-key="reference"
        @item-selected="select"
        @select-all="selectAll(group.table.items)"
      )
        template(#title) {{ group.title }}
        template(#reference="{ item }")
          nuxt-link.font-medium.text-link(:href="item.href") {{ item.reference }}
        template(#createdDate="{ item }")
          time(:datetime='item.createdDatetime') {{ item.createdDate }}
      div.w-full.flex.flex-row-reverse
        ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
          v-if="ordersSelectedVM.items.length > 0"
          @click="start"
        ) {{ index < 2 ? 'Commencer les préparations' : 'Imprimer les BL' }}
</template>

<script lang="ts" setup>
import { getPreparationsGaugeVM } from '@adapters/primary/view-models/preparations/get-preparations-gauge/getPreparationsGaugeVM'
import { getSelectedPreparationsVM } from '@adapters/primary/view-models/preparations/get-selected-preparations/getSelectedPreparationsVM'
import { listLocations } from '@core/usecases/locations/location-listing/listLocations'
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { resetPreparationSelection } from '@core/usecases/order/reset-preparation-selection/resetPreparationSelection'
import { startPreparations } from '@core/usecases/order/start-preparations/startPreparations'
import { toggleSelectAllPreparations } from '@core/usecases/order/toggle-select-all-preparations/toggleSelectAllPreparations'
import { toggleSelectPreparation } from '@core/usecases/order/toggle-select-preparation/toggleSelectPreparation'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { useLocationGateway } from '../../../../../../gateways/locationGateway'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import PreparationsGauge from '../molecules/PreparationsGauge.vue'

const gaugeVm = computed(() => getPreparationsGaugeVM(useDateProvider()))

definePageMeta({ layout: 'main' })

onMounted(() => {
  listLocations(useLocationGateway())
  fetchOrdersToPrepare()
})

defineProps({
  preparationsVm: {
    type: Object,
    default() {
      return {}
    }
  }
})

const fetchOrdersToPrepare = () => {
  listOrdersToPrepare(useOrderGateway(), useProductGateway())
}

const ordersSelectedVM = computed(() => {
  return getSelectedPreparationsVM()
})

const select = (selected: any) => {
  toggleSelectPreparation(selected)
}

const selectAll = (selected: Array<any>) => {
  toggleSelectAllPreparations(selected.map((s) => s.reference))
}

const resetSelection = () => {
  resetPreparationSelection()
}

const router = useRouter()

const start = () => {
  window.print()
  startPreparations(useOrderGateway())
  router.push('/preparations')
}
</script>
