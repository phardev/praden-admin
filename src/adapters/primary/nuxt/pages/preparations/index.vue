<template lang="pug">
div.hidden.printme.mx-2
  p Récapitulatif des commandes
  ft-table(
    :headers="startVM.headers"
    :items="startVM.global"
  )
  div.break-before-page(v-for="order in startVM.detail" :key="order.reference")
    div.flex
      h1.text-xl.grow Commande {{ order.reference }}
      client-only
        vueQr(:text="order.href")
    ft-table(
      :headers="startVM.headers"
      :items="order.lines"
    )
.section.no-printme
  tab-group.border-b.border-gray-200(as="div")
    tab-list.-mb-px.flex.space-x-8
      tab.w-full.rounded-md.border-neutral-light.py-2.pl-3.pr-10.text-base(
        v-for="(group, tabIndex) in Object.keys(preparationsVM)"
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
              v-if="preparationsVM[group].count"
              :class="[selected ? 'bg-contrast text-colored' : 'bg-light text-contrast', 'py-0.5 px-2.5 md:inline-block']"
              ) {{ preparationsVM[group].count }}
    tab-panels(v-for="(group, index) in Object.values(preparationsVM)" :key="index")
      tab-panel.mt-4
        ft-table(
          :headers="group.table.headers"
          :items="group.table.items"
          :selectable="true"
          :selection="ordersSelectedVM.items"
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
          ) Commencer les préparations
</template>

<script lang="ts" setup>
import { listOrdersToPrepare } from '@core/usecases/order/orders-to-prepare-listing/listOrdersToPrepare'
import { getPreparationsVM } from '@adapters/primary/view-models/get-orders-to-prepare/getPreparationsVM'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { getSelectedPreparationsVM } from '@adapters/primary/view-models/get-selected-preparations/getSelectedPreparationsVM'
import { toggleSelectPreparation } from '@core/usecases/order/toggle-select-preparation/toggleSelectPreparation'
import { toggleSelectAllPreparations } from '@core/usecases/order/toggle-select-all-preparations/toggleSelectAllPreparations'
import FtButton from '@adapters/primary/nuxt/components/FtButton.vue'
import { startPreparationsVM } from '@adapters/primary/view-models/start-preparations/startPreparationsVM'
import { startPreparations } from '@core/usecases/order/start-preparations/startPreparations'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { resetPreparationSelection } from '@core/usecases/order/reset-preparation-selection/resetPreparationSelection'

let vueQr
if (process.client) {
  import('vue-qr/src/packages/vue-qr.vue').then((module) => {
    vueQr = module.default
  })
}

definePageMeta({ layout: 'main' })

onMounted(() => {
  listOrdersToPrepare(useOrderGateway())
})

const preparationsVM = computed(() => {
  return getPreparationsVM()
})

const ordersSelectedVM = computed(() => {
  return getSelectedPreparationsVM()
})

const startVM = computed(() => {
  let origin = ''
  if (process.client) {
    origin = location.origin
  }
  return startPreparationsVM(origin)
})

const select = (selected: any) => {
  toggleSelectPreparation(selected.reference)
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
