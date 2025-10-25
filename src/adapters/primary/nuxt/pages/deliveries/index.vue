<template lang="pug">
div.hidden.printme.mx-2
  ft-table.mx-2(
    :headers="toPrint.headers"
    :is-loading="toPrint.isLoading"
    :items="toPrint.items"
  )
  div.flex.flex-row-reverse
    div
      p.mb-4 Nombre de colis {{ toPrint.count }}
      time(:datetime='new Date(now)') Le {{ timestampToLocaleString(now, 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
      p.mr-0 Signature
      canvas.w-64.h-24.border.border-opposite

.section.no-printme(v-if="deliveriesVM && deliveriesVM.items")
  .flex.flex-row-reverse
    ft-button(icon='i-heroicons-arrow-path' size="xl" :loading='deliveriesVM.isLoading' @click='() => listDeliveries(useDeliveryGateway())')
      | {{ $t('deliveries.refresh') }}
  tab-group.border-b.border-gray-200(as="div" @change="onTabChange")
    tab-list.-mb-px.flex.space-x-4
      tab.w-full.rounded-md.border-neutral-light.py-2.pl-3.pr-10.text-base.outline-0.cursor-pointer(
        v-for="(groupName, tabIndex) in sortedGroupNames"
        v-slot="{ selected }"
        :key="tabIndex"
        as="div"
      )
        div.whitespace-nowrap.flex.py-4.px-1.border-b-2.font-medium.text-sm(
          :class="[selected ? 'border-default text-colored' : 'border-transparent text-light-contrast hover:text-contrast hover-border-neutral-light']"
        )
          div {{ groupName }}
            span.hidden.ml-3.rounded-full.text-xs.font-medium(
              v-if="deliveriesVM.items[groupName].count"
              :class="[selected ? 'bg-contrast text-colored' : 'bg-light text-contrast', 'py-0.5 px-2.5 md:inline-block']"
            ) {{ deliveriesVM.items[groupName].count }}
    tab-panels
      tab-panel.mt-4(v-for="(groupName) in sortedGroupNames" :key="groupName")
        ft-table(
          :headers="deliveriesVM.items[groupName].table.headers"
          :items="deliveriesVM.items[groupName].table.items"
          :selectable="true"
          :selection="selectedUuids"
          :is-loading="deliveriesVM.isLoading"
          item-key="uuid"
          @item-selected="selection.toggleSelect"
          @select-all="selection.toggleSelectAll(deliveriesVM.items[groupName].table.items)"
        )
          template(#title) {{ $t('deliveries.title') }}
          template(#status="{ item }")
            ft-delivery-status-badge(:status="item.status")
        div.w-full.flex.flex-row-reverse.gap-4
          ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
            v-if="selection.get().length > 0"
            @click="validateShipping"
          ) {{ $t('deliveries.validateShipping') }}
          ft-button.button-solid.mt-4.mr-0.py-4.px-4.text-xl(
            v-if="selection.get().length > 0"
            @click="printResume"
          ) {{ $t('deliveries.printSummary') }}
</template>

<script lang="ts" setup>
import { useSelection } from '@adapters/primary/nuxt/composables/useSelection'
import { getDeliveriesVM } from '@adapters/primary/view-models/deliveries/get-deliveries-vm/getDeliveriesVM'
import { listCarriers } from '@core/usecases/carriers/carrier-listing/listCarriers'
import { listDeliveries } from '@core/usecases/deliveries/delivery-listing/listDeliveries'
import { shipDeliveries } from '@core/usecases/deliveries/delivery-shipping/shipDeliveries'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { timestampToLocaleString } from '@utils/formatters'
import { useCarrierGateway } from '../../../../../../gateways/carrierGateway'
import { useDateProvider } from '../../../../../../gateways/dateProvider'
import { useDeliveryGateway } from '../../../../../../gateways/deliveryGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listCarriers(useCarrierGateway())
  listDeliveries(useDeliveryGateway())
})

const now = useDateProvider().now()

const deliveriesVM = computed(() => {
  return getDeliveriesVM()
})

const toPrintHeader = [
  {
    name: 'Numéro de suivi',
    value: 'trackingNumber'
  },
  {
    name: 'Client',
    value: 'client'
  },
  {
    name: 'Poids (kg)',
    value: 'weight'
  }
]

const toPrint = computed(() => {
  const allItems = Object.values(deliveriesVM.value.items ?? {}).flatMap(
    (group) => group.table.items
  )
  const items = allItems.filter((item) =>
    selectedUuids.value.includes(item.uuid)
  )
  return {
    headers: toPrintHeader,
    items,
    count: items.length
  }
})

const selection = useSelection()

const sortedGroupNames = computed(() =>
  Object.keys(deliveriesVM.value.items ?? {}).sort((a, b) => a.localeCompare(b))
)

const selectedUuids = computed(() => {
  const sel = selection.get()
  if (
    sel.length > 0 &&
    typeof sel[0] === 'object' &&
    sel[0] !== null &&
    'uuid' in sel[0]
  ) {
    return sel.map((item) => item.uuid)
  }
  return sel
})

const onTabChange = () => {
  selection.clear()
}

const printResume = () => {
  window.print()
}

const validateShipping = async () => {
  await shipDeliveries(selectedUuids.value, useDeliveryGateway())
  selection.clear()
}
</script>
