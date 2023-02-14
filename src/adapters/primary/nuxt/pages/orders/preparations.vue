<template lang="pug">
div.hidden.printme.mx-2
  p Récapitulatif des commandes
  fv-table(
    :headers="startVM.headers"
    :items="startVM.global"
  )
  div.break-before-page(v-for="order in startVM.detail" :key="order.reference")
    div.flex
      h1.text-xl.grow Commande {{ order.reference }}
      vueQr(:text="order.href")
    fv-table(
      :headers="startVM.headers"
      :items="order.lines"
    )
.section.no-printme
  fv-table(
    :headers="ordersVM.headers"
    :items="ordersVM.items"
    :selectable="true"
    :selection="ordersSelectedVM.items"
    @item-selected="select"
    @select-all="selectAll"
  )
    template(#title) Commandes à préparer
    template(#reference="{ item }")
      .font-medium.text-default {{ item.reference }}
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
import { getOrdersToPrepareVM } from '@adapters/primary/view-models/get-orders-to-prepare/getOrdersToPrepareVM'
import { useOrderGateway } from '../../../../../../gateways/orderGateway'
import { getSelectedPreparationsVM } from '@adapters/primary/view-models/get-selected-preparations/getSelectedPreparationsVM'
import { toggleSelectPreparation } from '@core/usecases/order/toggle-select-preparation/toggleSelectPreparation'
import { toggleSelectAllPreparations } from '@core/usecases/order/toggle-select-all-preparations/toggleSelectAllPreparations'
import FtButton from '@adapters/primary/nuxt/components/FtButton.vue'
import { startPreparationsVM } from '@adapters/primary/view-models/start-preparations/startPreparationsVM'
import isBrowser from 'is-browser'
import { startPreparations } from '@core/usecases/order/start-preparations/startPreparations'

let vueQr
if (isBrowser) {
  import('vue-qr/src/packages/vue-qr.vue').then((module) => {
    vueQr = module.default
  })
}

onMounted(() => {
  listOrdersToPrepare(useOrderGateway())
})

const ordersVM = computed(() => {
  return getOrdersToPrepareVM()
})

const ordersSelectedVM = computed(() => {
  return getSelectedPreparationsVM()
})

const startVM = computed(() => {
  return startPreparationsVM(location.origin)
})

const select = (selected: any) => {
  toggleSelectPreparation(selected.reference)
}

const selectAll = () => {
  toggleSelectAllPreparations()
}

const router = useRouter()

const start = () => {
  window.print()
  startPreparations(useOrderGateway())
  router.push('/orders/preparations')
}
</script>
