<template lang="pug">
tab-group.border-b.border-gray-200(as="div")
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
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { getSelectedPreparationsVM } from '@adapters/primary/view-models/preparations/get-selected-preparations/getSelectedPreparationsVM'
import { toggleSelectPreparation } from '@core/usecases/order/toggle-select-preparation/toggleSelectPreparation'
import { toggleSelectAllPreparations } from '@core/usecases/order/toggle-select-all-preparations/toggleSelectAllPreparations'
import { startPreparations } from '@core/usecases/order/start-preparations/startPreparations'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { resetPreparationSelection } from '@core/usecases/order/reset-preparation-selection/resetPreparationSelection'
import { useProductGateway } from '../../../../../../gateways/productGateway'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { useEmailGateway } from '../../../../../../gateways/emailGateway'
import { listLocations } from '@core/usecases/locations/location-listing/listLocations'
import { useLocationGateway } from '../../../../../../gateways/locationGateway'

definePageMeta({ layout: 'main' })

onMounted(() => {
  listLocations(useLocationGateway())
  listOrdersToPrepare(useOrderGateway(), useProductGateway())
})

defineProps({
  preparationsVm: {
    type: Object,
    default() {
      return {}
    }
  }
})

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
  startPreparations(useOrderGateway(), useEmailGateway())
  router.push('/preparations')
}
</script>
